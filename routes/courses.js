const express = require("express")

const router = new express.Router({ mergeParams: true })

const {
	getCourse,
	getCourses,
	createCourse,
	updateCourse,
	deleteCourse,
} = require("../controllers/courses")

const { protect } = require("../middleware/auth")

// Course model for advacedSearch
const Course = require("../models/Course")
// advancedSearch middleware
const advancedResults = require("../middleware/advancedResults")

router
	.route("/")
	.get(advancedResults(Course), getCourses)
	.post(protect, createCourse)
router
	.route("/:id")
	.get(getCourse)
	.put(protect, updateCourse)
	.delete(protect, deleteCourse)

module.exports = router
