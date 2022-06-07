import express, { NextFunction, Request, Response, Router } from "express";

class UserRouter {

	router: Router;

	constructor() {
		this.router = express.Router();
		this.router.get("/", this.getUserRouter);
	}

	getUserRouter = (req: Request, res: Response, next: NextFunction) => {
		res.status(200).send({});
	}
}

export default UserRouter;