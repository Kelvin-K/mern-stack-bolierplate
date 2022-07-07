import * as redis from "redis";

class RedisHelper {
	static client: ReturnType<typeof redis.createClient>;
	static connect = async (url: string, password: string) => {
		this.client = redis.createClient({
			url,
			password
		});

		this.client.on("connect", () => {
			console.log("Client connected to redis.");
		})

		this.client.on("ready", () => {
			console.log("Client connected to redis and ready to use.");
		})

		this.client.on('error', (err) => {
			console.log(err.message);
		})

		await this.client.connect();

		process.on("SIGINT", async () => {
			this.client.quit();
		});
	}
}

export default RedisHelper;