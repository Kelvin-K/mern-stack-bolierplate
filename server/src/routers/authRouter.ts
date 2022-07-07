import express, { NextFunction, Request, Response, Router } from "express";
import createError from "http-errors";
import User from "../db/user";
import RedisHelper from "../helper/redisHelper";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './../helper/jwtHelper';

class AuthRouter {
	router: Router;
	constructor() {
		this.router = express.Router();
		this.router.post("/register", this.registerUser);
		this.router.post("/login", this.login);
		this.router.post("/refresh-token", this.refreshToken);
		this.router.delete("/logout", this.logout);
	}

	registerUser = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = new User(req.body);
			const validationError = user.validateSync();

			if (validationError) throw new createError.UnprocessableEntity(JSON.stringify(validationError));
			if (await User.findOne({ username: user.username })) throw new createError.Conflict(`Username is already in use!`);
			if (await User.findOne({ email: user.email })) throw new createError.Conflict(`Email is already registered!`);

			await user.save();

			res.send("User created successfully.")
		}
		catch (error) {
			next(error);
		}
	}

	login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { username, password } = req.body;

			if (!username) throw new createError.BadRequest("Username is required!");
			if (!password) throw new createError.BadRequest("Password is required!");

			const user = await User.findOne({ username });
			if (!user) throw new createError.NotFound("User not registered.");

			const isMatch = await user.isValidPassword(password);
			if (!isMatch) throw new createError.Unauthorized("Username/Password not valid.");

			const accessToken = await signAccessToken(user.id);
			const refreshToken = await signRefreshToken(user.id);

			await RedisHelper.client.set(user.id, refreshToken, {
				EX: 365 * 24 * 60 * 60
			});

			res.cookie("refreshToken", refreshToken, { httpOnly: true }).send({ accessToken });
		}
		catch (error) {
			next(error);
		}
	}

	refreshToken = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const refreshToken = req.cookies["refreshToken"];
			if (!refreshToken) throw new createError.BadRequest();

			const payload = await verifyRefreshToken(refreshToken);
			const redisRefToken = await RedisHelper.client.get(payload.aud);
			if (redisRefToken !== refreshToken) {
				await RedisHelper.client.del(payload.aud);
				res.clearCookie("refreshToken");
				throw new createError.Unauthorized();
			}

			const accessToken = await signAccessToken(payload.aud);
			const newRefToken = await signRefreshToken(payload.aud);

			await RedisHelper.client.set(payload.aud, newRefToken, {
				EX: 365 * 24 * 60 * 60
			});

			res.cookie("refreshToken", newRefToken, { httpOnly: true }).send({ accessToken });
		}
		catch (error) {
			next(error);
		}
	}

	logout = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const refreshToken = req.cookies["refreshToken"];
			if (!refreshToken) throw new createError.BadRequest();

			const payload = await verifyRefreshToken(refreshToken);

			await RedisHelper.client.del(payload.aud);

			res.clearCookie("refreshToken").send("Logged out successfully!");
		}
		catch (error) {
			next(error);
		}
	}
}

export default AuthRouter;