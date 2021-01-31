const express = require("express")

const router = new express.Router({ mergeParams: true })

const {
	getCourse,
	getCourses,
	createCourse,
	updateCourse,
	deleteCourse,
} = require("../controllers/courses")

router.route("/").get(getCourses).post(createCourse)
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router
