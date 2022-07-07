import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import MongoHelper from "./helper/mongoHelper";
import RedisHelper from "./helper/redisHelper";
import LoggingMiddleWare from "./middleware/loggingMiddleWare";
import AuthRouter from "./routers/authRouter";
import HealthRouter from "./routers/healthRouter";
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
		this.app.use(cookieParser());
		this.app.use(cors());
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.json({ type: 'application/*+json' }));
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
		this.app.use(bodyParser.text({ type: 'text/html' }));
		this.app.use(LoggingMiddleWare);
		this.app.use(express.static('public'));
	}

	configureRoutes = () => {
		// api
		this.app.use("/api/health", new HealthRouter().router);
		this.app.use("/api/users", new UserRouter().router);
		this.app.use("/api", new AuthRouter().router);

		// swagger
		this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

		// client
		this.app.use((req: Request, res: Response) => res.sendFile(path.resolve('public', 'index.html')));

		// Error Handling
		this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
			res.status(err.status || 500)
			res.send({
				error: {
					status: err.status || 500,
					message: err.message
				}
			});
		});
	}

	start = async (port: any, databaseUrl: string) => {
		try {
			await MongoHelper.connect(databaseUrl);
			await RedisHelper.connect("redis://localhost:6379", "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81");
			this.app.listen(port, () => console.log(`Server started listening at http://localhost:${port}/\nAccess API documentation by http://localhost:${port}/api-docs`));
		}
		catch (error) {
			console.log(`Server failed to start.\nOriginal Error: ${JSON.stringify(error, null, 2)}`);
		}
	}
}

export default ExpressServer;