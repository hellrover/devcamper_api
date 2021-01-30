exports.getBootcamps = async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: "Getting all Bootcamps",
	})
}

exports.getBootcamp = async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: "Get single Bootcamp",
	})
}

exports.createBootcamp = async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: "Create Bootcamp",
	})
}

exports.updateBootcamp = async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: "Update Bootcamp",
	})
}

exports.deleteBootcamp = async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: "Delete Bootcamp",
	})
}
