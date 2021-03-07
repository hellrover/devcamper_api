const express = require("express")

const router = new express.Router({ mergeParams: true })

const {
	getCourse,
	getCourses,
	createCourse,
	updateCourse,
	deleteCourse,
} = require("../controllers/courses")

const { protect, authorize } = require("../middleware/auth")

// Course model for advacedSearch
const Course = require("../models/Course")
// advancedSearch middleware
const advancedResults = require("../middleware/advancedResults")

router
	.route("/")
	.get(advancedResults(Course), getCourses)
	.post(protect, authorize("publisher", "admin"), createCourse)
router
	.route("/:id")
	.get(getCourse)
	.put(protect, authorize("publisher", "admin"), updateCourse)
	.delete(protect, authorize("publisher", "admin"), deleteCourse)

module.exports = router
