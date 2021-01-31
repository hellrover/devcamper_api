const express = require("express")

const router = new express.Router()
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	photoUpload,
} = require("../controllers/bootcamps")

// Course router
const courseRouter = require("./courses")

// Bootcamp model for advancedSearch
const Bootcamp = require("../models/Bootcamp")
// advancedSearch middleware
const advancedResults = require("../middleware/advancedResults")

router.use("/:id/courses", courseRouter)

router
	.route("/")
	.get(
		advancedResults(Bootcamp, { path: "courses", select: "title tuition" }),
		getBootcamps
	)
	.post(createBootcamp)
router.route("/:id").get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)
router.route("/:id/photo").put(photoUpload)

module.exports = router
