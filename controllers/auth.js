const crypto = require("crypto")
const User = require("../models/User")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/ErrorResponse")
const sendEmail = require("../utils/sendEmail")

exports.register = asyncHandler(async (req, res, next) => {
	const { email, name, role, password } = req.body
	const user = await User.create({ email, name, role, password })

	sendTokenResponse(user, 200, res)
})

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body
	if (!email || !password) {
		return next(new ErrorResponse(400, "Please enter a username and password"))
	}

	const user = await User.findOne({ email }).select("+password")

	if (!user) {
		return next(new ErrorResponse(400, "Invalid credentials"))
	}

	const isMatch = await user.matchPasswords(password)

	if (!isMatch) {
		return next(new ErrorResponse(400, "Invalid credentials"))
	}

	sendTokenResponse(user, 200, res)
})

exports.getMe = asyncHandler(async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: req.user,
	})
})

exports.updateDetails = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate = {
		email: req.body.email,
		name: req.body.name,
	}
	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
		new: true,
		runValidators: true,
	})

	res.status(200).json({
		success: true,
		data: user,
	})
})

exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password")

	if (!req.body.newpassword) {
		return next(new ErrorResponse(400, "Enter new password"))
	}

	if (!(await user.matchPasswords(req.body.currentpassword))) {
		return next(new ErrorResponse(400, "Wrong password"))
	}

	user.password = req.body.newpassword

	await user.save()

	sendTokenResponse(user, 200, res)
})

exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email })

	if (!user) {
		return next(new ErrorResponse(404, "There is no user with that email"))
	}

	const resetToken = user.getPasswordResetToken()

	await user.save({ validateBeforeSave: false })

	const resetUrl = `${req.protocol}://${req.hostname}/api/v1/auth/resetpassword/${resetToken}`

	const message = `Hello, ${user.name}, You are recieving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: ${resetUrl}`

	try {
		await sendEmail({
			mailTo: user.email,
			subject: "Reset password",
			message,
		})

		return res.status(200).json({
			success: true,
			data: "Email sent",
		})
	} catch (error) {
		console.log(error)
		user.resetPasswordExpire = undefined
		user.resetPasswordToken = undefined

		await user.save({ validateBeforeSave: false })

		return next(500, "Email could not be sent")
	}
})

exports.resetPassword = asyncHandler(async (req, res, next) => {
	const resetToken = req.params.token
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex")

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	})

	if (!user) {
		return next(new ErrorResponse(400, "Invalid token"))
	}

	user.password = req.body.password
	user.resetPasswordToken = undefined
	user.resetPasswordExpire = undefined
	await user.save()

	sendTokenResponse(user, 200, res)
})

const sendTokenResponse = function (user, statusCode, res) {
	const token = user.getJsonWebToken()

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	}

	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		token,
	})
}
