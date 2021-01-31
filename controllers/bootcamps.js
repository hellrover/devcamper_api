const Bootcamp = require("../models/Bootcamp")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/ErrorResponse")

exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let queryStr = JSON.stringify(req.query)
	queryStr.replace(/\b(lte|lt|gte|gt|in)\b/g, (match) => `$${match}`)
	queryStr = JSON.parse(queryStr)

	const filterFields = ["sort", "select", "limit", "page"]

	filterFields.forEach((field) => {
		delete queryStr[field]
	})

	let query = Bootcamp.find(queryStr)

	if (req.query.sort) {
		query = query.sort(req.query.sort.split(",").join(" "))
	}

	if (req.query.select) {
		query = query.select(req.query.select.split(",").join(" "))
	}

	const page = parseInt(req.query.page) || 1
	const limit = parseInt(req.query.limit) || 3

	const startIndex = (page - 1) * limit
	const endIndex = page * limit
	const total = await Bootcamp.countDocuments()

	query = await query.skip(startIndex).limit(limit)

	const paginaton = {}

	if (startIndex > 0) {
		paginaton.prev = {
			prev: page - 1,
			limit,
		}
	}

	if (endIndex < total) {
		paginaton.next = {
			next: page + 1,
			limit,
		}
	}

	res.status(200).json({
		success: true,
		paginaton,
		count: query.length,
		data: query,
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
