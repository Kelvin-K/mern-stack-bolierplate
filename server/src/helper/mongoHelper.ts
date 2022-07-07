import mongoose from "mongoose";

class MongoHelper {
	static connect = async (url: string) => {
		mongoose.connection.on("connected", () => {
			console.log("Mongoose connected to db.");
		})

		mongoose.connection.on("error", error => {
			console.log(error.message);
		})

		mongoose.connection.on("disconnected", () => {
			console.log("Mongoose connected to disconnected.");
		})

		process.on("SIGINT", async () => {
			await mongoose.connection.close();
		});

		await mongoose.connect(url);
	}
}

export default MongoHelper;