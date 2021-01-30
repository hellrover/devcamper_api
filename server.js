const express = require("express")
const morgan = require("morgan")
require("dotenv").config({ path: "./config/config.env" })
require("colors")
const logger = require("./middleware/logger")
const errorHandler = require("./middleware/error")
const connectDB = require("./config/db")

const bootcampRouter = require("./routes/bootcamps")

connectDB()

const app = express()
app.use(express.json())
app.use(logger)
app.use(morgan("dev"))
app.use("/api/v1/bootcamps", bootcampRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(
	PORT,
	console.log(
		`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.inverse
	)
)

process.on("unhandledRejection", (reason, promise) => {
	console.log(`Error ${reason}`)
	server.close(() => process.exit(1))
})
