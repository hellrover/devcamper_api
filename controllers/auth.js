const User = require("../models/User")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/ErrorResponse")

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
