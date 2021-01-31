const Course = require("../models/Course")
const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/ErrorResponse")

exports.getCourses = asyncHandler(async (req, res, next) => {
	const query = {}
	if (req.params.id) {
		query.bootcamp = req.params.id
	}
	console.log(query)
	const courses = await Course.find(query).populate("bootcamp")

	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	})
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
	await course.remove()
	res.status(200).json({
		success: true,
		data: "Course deleted",
	})
})
