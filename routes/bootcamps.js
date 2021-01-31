const express = require("express")

const router = new express.Router()
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
} = require("../controllers/bootcamps")

// Course router
const courseRouter = require("./courses")

router.use("/:id/courses", courseRouter)

router.route("/").get(getBootcamps).post(createBootcamp)
router.route("/:id").get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

module.exports = router
