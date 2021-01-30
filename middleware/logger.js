const logger = (req, res, next) => {
	console.log(
		`Request: ${req.method}: ${req.protocol}://${req.hostname}/${req.originalUrl}`
			.magenta.underline
	)
	next()
}

module.exports = logger
