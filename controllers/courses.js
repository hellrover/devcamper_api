const Course = require("../models/Course")
const Bootcamp = require("../models/Bootcamp")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/ErrorResponse")

exports.getCourses = asyncHandler(async (req, res, next) => {
	const query = {}
	if (req.params.id) {
		const courses = await Course.find({ bootcamp: req.params.id })
		return res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		})
	}

	res.status(200).json(res.advancedSearch)
})

exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: "bootcamp",
		select: "name description",
	})
	if (!course) {
		return next(new ErrorResponse(404, "Course not found"))
	}
	res.status(200).json({
		success: true,
		data: course,
	})
})

exports.createCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.id

	const bootcamp = await Bootcamp.findById(req.params.id)

	if (!bootcamp) {
		return next(new ErrorResponse(404, "Bootcamp not found"))
	}

	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(new ErrorResponse(401, "Not allowed to access this route"))
	}

	const course = await Course.create(req.body)
	res.status(200).json({
		success: true,
		data: course,
	})
})

exports.updateCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findByIdAndUpdate(req.params.id, { new: true })
	if (!course) {
		return next(new ErrorResponse(404, "Course not found"))
	}

	if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(new ErrorResponse(401, "Not allowed to access this route"))
	}

	res.status(200).json({
		success: true,
		data: course,
	})
})

exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id)
	if (!course) {
		return next(new ErrorResponse(404, "Course not found"))
	}

	if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(new ErrorResponse(401, "Not allowed to access this route"))
	}

	await course.remove()
	res.status(200).json({
		success: true,
		data: "Course deleted",
	})
})
