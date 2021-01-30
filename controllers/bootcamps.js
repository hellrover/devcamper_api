const Bootcamp = require("../models/Bootcamp")

exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find()
		res.status(200).json({
			success: true,
			count: bootcamps.length,
			data: bootcamps,
		})
	} catch (error) {
		console.log(error)
		res.status(400).json({
			success: false,
			data: error.message,
		})
	}
}

exports.getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id)
		if (!bootcamp) {
			res.status(404).json({
				success: false,
				data: "Bootcamp not found",
			})
		}
		res.status(200).json({
			success: true,
			data: bootcamp,
		})
	} catch (error) {
		console.log(error)
		res.status(400).json({
			success: false,
			data: error.message,
		})
	}
}

exports.createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body)
		res.status(200).json({
			success: true,
			data: bootcamp,
		})
	} catch (error) {
		console.log(error)
		res.status(400).json({
			success: false,
			data: error.message,
		})
	}
}

exports.updateBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id)
		if (!bootcamp) {
			res.status(404).json({
				success: false,
				data: "Bootcamp not found",
			})
		}
		Object.keys(req.body).forEach((field) => {
			bootcamp[field] = req.body[field]
		})
		await bootcamp.save()
		res.status(200).json({
			success: true,
			data: bootcamp,
		})
	} catch (error) {
		console.log(error)
		res.status(400).json({
			success: false,
			data: error.message,
		})
	}
}

exports.deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id)
		if (!bootcamp) {
			res.status(404).json({
				success: false,
				data: "Bootcamp not found",
			})
		}
		await bootcamp.remove()
		res.status(200).json({
			success: true,
			data: "Bootcamp deleted",
		})
	} catch (error) {
		console.log(error)
		res.status(400).json({
			success: false,
			data: error.message,
		})
	}
}
