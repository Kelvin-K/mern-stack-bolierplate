import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import swaggerUi from "swagger-ui-express";
import LoggingMiddleWare from "./middleware/loggingMiddleWare";
import HealthCheckRouter from "./routers/healthCheckRouter";
import UserRouter from "./routers/userRouter";

const swaggerDocument = require('./swagger.json');

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
		this.app.use(LoggingMiddleWare);

		// Serve static files
		this.app.use(express.static('public'));

		this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	}

	configureRoutes = () => {
		// api
		this.app.use("/api/health", new HealthCheckRouter().router);
		this.app.use("/api/users", new UserRouter().router);

		// client
		this.app.get("*", (req: Request, res: Response) => res.sendFile(path.resolve('public', 'index.html')));
	}

	start = async (port: any, databaseUrl: string) => {
		try {
			await mongoose.connect(databaseUrl);
			this.app.listen(port, () => console.log(`Server started listening at http://localhost:${port}/\nAccess API documentation by http://localhost:${port}/api-docs`));
		}
		catch (error) {
			console.log(`Server failed to start.\nOriginal Error: ${JSON.stringify(error, null, 2)}`);
		}
	}
}

export default ExpressServer;