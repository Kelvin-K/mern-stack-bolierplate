import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import mongoose from "mongoose";
import path from "path";
import LoggingMiddleWare from "./middleware/loggingMiddleWare";
import HealthCheckRouter from "./routers/healthCheckRouter";
import UserRouter from "./routers/userRouter";

class ExpressServer {

	app: Express;

	constructor() {
		this.app = express();
		this.configureMiddleware();
		this.configureRoutes();
	}

	configureMiddleware = () => {
		// Parse cookies		
		this.app.use(cookieParser());

		// CORS		
		this.app.use(cors());

		// Parse application/json
		this.app.use(bodyParser.json());

		// parse various different custom JSON types as JSON
		this.app.use(bodyParser.json({ type: 'application/*+json' }));

		// Parse application/x-www-form-urlencoded
		this.app.use(bodyParser.urlencoded({ extended: false }));

		// parse some custom thing into a Buffer
		this.app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));

		// parse an HTML body into a string
		this.app.use(bodyParser.text({ type: 'text/html' }));

		// Log requests for auditing purpose
		this.app.use(LoggingMiddleWare());

		// Serve static files
		this.app.use(express.static('public'));
	}

	configureRoutes = () => {
		this.app.use("/api/health", new HealthCheckRouter().router);
		this.app.use("/api/user", new UserRouter().router);

		this.app.get("*", (req, res) => res.sendFile(path.resolve('public', 'index.html')));
	}

	start = async (port: any) => {
		await mongoose.connect(process.env.DATABASE_CONNECTION_STRING!);
		this.app.listen(port, () => {
			console.log(`Server started listening at http://localhost:${port}/`);
		});
	}
}

export default ExpressServer;