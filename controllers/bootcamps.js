const Bootcamp = require("../models/Bootcamp")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/ErrorResponse")

exports.getBootcamps = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.find()
	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	})
})

exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id)
	if (!bootcamp) {
		return next(new ErrorResponse(404, "Resource not found"))
	}
	res.status(200).json({
		success: true,
		data: bootcamp,
	})
})

exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body)
	res.status(200).json({
		success: true,
		data: bootcamp,
	})
})

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id)
	if (!bootcamp) {
		return next(new ErrorResponse("404", "Resource not found"))
	}
	Object.keys(req.body).forEach((field) => {
		bootcamp[field] = req.body[field]
	})
	await bootcamp.save()
	res.status(200).json({
		success: true,
		data: bootcamp,
	})
})

exports.deleteBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id)
	if (!bootcamp) {
		return next(new ErrorResponse(404, "Resource not found"))
	}
	await bootcamp.remove()
	res.status(200).json({
		success: true,
		data: "Bootcamp deleted",
	})
}
