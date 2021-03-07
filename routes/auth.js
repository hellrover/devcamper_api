const express = require("express")

const router = new express.Router()

const {
	register,
	login,
	getMe,
	forgotPassword,
	resetPassword,
	updateDetails,
	updatePassword,
} = require("../controllers/auth")

const { protect } = require("../middleware/auth")

router.post("/register", register)
router.post("/login", login)
router.get("/me", protect, getMe)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword/:token", resetPassword)
router.put("/updateDetails", protect, updateDetails)
router.put("/updatepassword", protect, updatePassword)
module.exports = router
