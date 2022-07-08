import express, { NextFunction, Request, Response, Router } from "express";
import createHttpError from 'http-errors';
import User from "../db/user";
import AuthenticationMiddleware from "../middleware/authenticationMiddleware";

class UserRouter {

	router: Router;

	constructor() {
		this.router = express.Router();
		this.router.get("/", AuthenticationMiddleware, this.getUserDetails);
	}

	getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await User.findById(req.payload.aud);
			if (!user) throw new createHttpError.NotFound("User not found!")

			const { username, email, firstName, lastName, contactNumber } = user;
			res.send({ username, email, firstName, lastName, contactNumber });
		}
		catch (error) {
			next(error);
		}
	}
}

export default UserRouter;