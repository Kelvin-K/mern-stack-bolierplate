import express, { NextFunction, Request, Response, Router } from "express";

class HealthCheckRouter {
	router: Router;
	constructor() {
		this.router = express.Router();
		this.router.get("/", this.getHealthCheckRouter);
	}

	getHealthCheckRouter = (req: Request, res: Response, next: NextFunction) => {
		res.status(200).send("Healthy");
	}
}

export default HealthCheckRouter;