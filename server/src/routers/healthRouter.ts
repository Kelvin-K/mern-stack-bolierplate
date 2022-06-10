import express, { NextFunction, Request, Response, Router } from "express";
import HttpStatusCodes from 'http-status-codes';

class HealthRouter {

	router: Router;

	constructor() {
		this.router = express.Router();
		this.router.get("/", this.getSystemHealth);
	}

	getSystemHealth = (req: Request, res: Response, next: NextFunction) => {
		res.status(HttpStatusCodes.OK).send("Healthy");
	}
}

export default HealthRouter;