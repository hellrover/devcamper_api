const mongoose = require("mongoose")

const connectDB = async (logMsg = false) => {
	const conn = await mongoose.connect(process.env.MONGO_URI, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})

	if (logMsg) {
		console.log(`Database connected to ${conn.connection.host}`.yellow.inverse)
	}
}

module.exports = connectDB
