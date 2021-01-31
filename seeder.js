const fs = require("fs")
require("dotenv").config({ path: "./config/config.env" })
require("./config/db")(true)
require("colors")

// Models
const Bootcamp = require("./models/Bootcamp")
const Course = require("./models/Course")

// JSON Data
const bootcamps = JSON.parse(fs.readFileSync("./_data/bootcamps.json"))
const courses = JSON.parse(fs.readFileSync("./_data/courses.json"))

const importData = async () => {
	try {
		await Bootcamp.create(bootcamps)
		await Course.create(courses)
		console.log("Data imported".green.inverse)
		process.exit(1)
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany()
		await Course.deleteMany()
		console.log("Data deleted".red.inverse)
		process.exit(1)
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}

if (process.argv[2] === "-i") {
	importData()
} else if (process.argv[2] === "-d") {
	deleteData()
} else {
	console.log("Choose an option")
	process.exit()
}
