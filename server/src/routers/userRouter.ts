import express, { Request, Response, Router } from "express";
import HttpStatusCodes from "http-status-codes";
import User from "../db/user";

class UserRouter {

	router: Router;

	constructor() {
		this.router = express.Router();
		this.router.get("/", this.getUsers);
		this.router.post("/", this.addNewUser);
		this.router.get("/:id", this.getUser);
		this.router.patch("/:id", this.patchUser);
	}

	getUser = async (req: Request, res: Response) => {
		const user = await User.find({ _id: req.params.id });
		if (!user)
			res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found!" });
		else
			res.status(HttpStatusCodes.OK).send(user);
	}

	getUsers = async (req: Request, res: Response) => {
		const users = await User.find({});
		res.status(HttpStatusCodes.OK).send(users);
	}

	addNewUser = async (req: Request, res: Response) => {
		const user = new User(req.body);
		try {
			await user.save();
			res.status(HttpStatusCodes.OK).send();
		}
		catch (error) {
			res.status(HttpStatusCodes.BAD_REQUEST).send(error);
		}
	}

	patchUser = async (req: Request, res: Response) => {
		try {
			await User.findOneAndUpdate({ _id: req.params.id }, req.body);
			res.status(HttpStatusCodes.OK).send();
		}
		catch (error) {
			res.status(HttpStatusCodes.BAD_REQUEST).send(error);
		}

	}
}

export default UserRouter;