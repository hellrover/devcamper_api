const path = require("path")
const Bootcamp = require("../models/Bootcamp")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/ErrorResponse")

exports.getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedSearch)
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
	const hasPublishedBootcamp = await Bootcamp.findOne({ user: req.user.id })
	if (hasPublishedBootcamp && req.user.role !== "admin") {
		return next(
			new ErrorResponse(404, "This user already have a published bootcamp")
		)
	}
	req.body.user = req.user.id
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

	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse("401", "This action is not allowed for current user")
		)
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

exports.photoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id)
	if (!bootcamp) {
		return next(new ErrorResponse(404, "Bootcamp not found"))
	}

	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse("401", "This action is not allowed for current user")
		)
	}

	if (!req.files) {
		return next(new ErrorResponse(400, "Please select file to upload"))
	}
	const file = req.files.file
	if (!file.mimetype.startsWith("image/")) {
		return next(new ErrorResponse(400, "Please select an image file to upload"))
	}
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(new ErrorResponse(400, "Image too big"))
	}
	file.name = `photo_${bootcamp.id}${path.parse(file.name).ext}`
	console.log(file.name)
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
		if (error) {
			console.log(error)
			return next(new ErrorResponse(500, "Upload error"))
		} else {
			bootcamp.photo = file.name
			await bootcamp.save()
			res.status(200).json({
				success: true,
				data: file.name,
			})
		}
	})
})

exports.deleteBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id)
	if (!bootcamp) {
		return next(new ErrorResponse(404, "Resource not found"))
	}

	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse("401", "This action is not allowed for current user")
		)
	}

	await bootcamp.remove()
	res.status(200).json({
		success: true,
		data: "Bootcamp deleted",
	})
}
