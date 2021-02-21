const jwt = require("jsonwebtoken")
const User = require("../models/User")
const asyncHandler = require("./async")
const ErrorResponse = require("../utils/ErrorResponse")

exports.protect = asyncHandler(async (req, res, next) => {
	let token

	if (
		!req.headers.authorization ||
		!req.headers.authorization.startsWith("Bearer")
	) {
		return next(new ErrorResponse(400, "Please log in to proceed"))
	}

	token = req.headers.authorization.split(" ")[1]

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		console.log(decoded)
		const user = await User.findById(decoded.id)
		if (!user) {
			return next(new ErrorResponse(400, "Please log in to proceed"))
		}
		req.user = user
		next()
	} catch (error) {
		return next(new ErrorResponse(400, error.message))
	}
})

exports.authorize = (...roles) => {
	return asyncHandler(async (req, res, next) => {
		console.log("Hi")
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					400,
					`Role "${req.user.role}" is not authorized to access this route`
				)
			)
		}
		next()
	})
}
