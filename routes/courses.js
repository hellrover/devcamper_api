const express = require("express")

const router = new express.Router({ mergeParams: true })

const {
	getCourse,
	getCourses,
	createCourse,
	updateCourse,
	deleteCourse,
} = require("../controllers/courses")

// Course model for advacedSearch
const Course = require("../models/Course")
// advancedSearch middleware
const advancedResults = require("../middleware/advancedResults")

router.route("/").get(advancedResults(Course), getCourses).post(createCourse)
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router
