const asyncHandler = require("./async")
const ErrorResponse = require("../utils/ErrorResponse")

const advancedResults = (model, populate) =>
	asyncHandler(async (req, res, next) => {
		let queryStr = JSON.stringify(req.query)
		queryStr.replace(/\b(lte|lt|gte|gt|in)\b/g, (match) => `$${match}`)
		queryStr = JSON.parse(queryStr)

		const filterFields = ["sort", "select", "limit", "page"]

		filterFields.forEach((field) => {
			delete queryStr[field]
		})

		let query = model.find(queryStr)

		if (req.query.sort) {
			query = query.sort(req.query.sort.split(",").join(" "))
		}

		if (req.query.select) {
			query = query.select(req.query.select.split(",").join(" "))
		}

		if (populate) {
			query = query.populate(populate)
		}

		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 3

		const startIndex = (page - 1) * limit
		const endIndex = page * limit
		const total = await model.countDocuments()

		query = await query.skip(startIndex).limit(limit)

		const paginaton = {}

		if (startIndex > 0) {
			paginaton.prev = {
				prev: page - 1,
				limit,
			}
		}

		if (endIndex < total) {
			paginaton.next = {
				next: page + 1,
				limit,
			}
		}

		res.advancedSearch = {
			success: true,
			count: query.length,
			paginaton,
			data: query,
		}

		next()
	})

module.exports = advancedResults
