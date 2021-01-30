const ErrorResponse = require("../utils/ErrorResponse")

const errorHandler = (error, req, res, next) => {
	console.log(error.stack)
	let err = { ...error }
	err.message = error.message

	if (error.name === "CastError") {
		const message = `Resource not found`
		err = new ErrorResponse(404, message)
	}

	if (error.code === 11000) {
		const field = Object.keys(error.keyPattern)[0]
		const message = `This ${field} already exist. Try again with another ${field}`
		err = new ErrorResponse(400, message)
	}

	if (error.name === "ValidationError") {
		const message = Object.values(error.errors).join(", ")
		err = new ErrorResponse(400, message)
	}

	res.status(err.statusCode || 400).json({
		success: false,
		data: err.message || "Server error",
	})
}

module.exports = errorHandler
