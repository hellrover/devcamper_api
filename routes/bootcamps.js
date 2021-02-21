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

const { protect, authorize } = require("../middleware/auth")

router.use("/:id/courses", courseRouter)

router
	.route("/")
	.get(
		advancedResults(Bootcamp, { path: "courses", select: "title tuition" }),
		getBootcamps
	)
	.post(protect, createBootcamp)
router
	.route("/:id")
	.get(protect, authorize("admin"), getBootcamp)
	.put(protect, updateBootcamp)
	.delete(protect, deleteBootcamp)
router.route("/:id/photo").put(protect, photoUpload)

module.exports = router
