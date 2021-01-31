const ErrorResponse = require("../utils/ErrorResponse")

const errorHandler = (error, req, res, next) => {
	console.log(error)
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
		let message = Object.values(error.errors).join(", ")
		// On createCourse, when Bootcamp not found by given id param
		if (message.includes("CastError:")) {
			message = `Resource not found`
		}
		err = new ErrorResponse(400, message)
	}

	res.status(err.statusCode || 400).json({
		success: false,
		data: err.message || "Server error",
	})
}

module.exports = errorHandler
