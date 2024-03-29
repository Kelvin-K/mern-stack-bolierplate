import express, { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import userLoginValidator from "../common/validators/userLoginValidator";
import userRegistrationValidator from "../common/validators/userRegistrationValidator";
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
			const { error, value: validatedUser } = userRegistrationValidator.validate(req.body);
			if (error) throw new createHttpError.UnprocessableEntity(error.message);

			const { confirmPassword, ...userDetails } = validatedUser;
			const user = new User(userDetails);
			if (await User.findOne({ username: user.username })) throw new createHttpError.Conflict("Username is already in use.");
			if (await User.findOne({ email: user.email })) throw new createHttpError.Conflict("Email is already registered.");

			await user.save();

			res.send({ message: "User created successfully." });
		}
		catch (error) {
			next(error);
		}
	}

	login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { error, value: validatedUser } = userLoginValidator.validate(req.body);
			if (error) throw new createHttpError.UnprocessableEntity(error.message);

			const { username, password } = validatedUser;
			const user = await User.findOne({ username });
			if (!user) throw new createHttpError.NotFound("User is not registered.");

			const isMatch = await user.isValidPassword(password);
			if (!isMatch) throw new createHttpError.Unauthorized("Username and Password combination is invalid.");

			const accessToken = await signAccessToken(user.id, { role: user.role });
			const refreshToken = await signRefreshToken(user.id);
			await RedisHelper.client.set(user.id, refreshToken, { EX: 365 * 24 * 60 * 60 });

			res.cookie("refreshToken", refreshToken, { httpOnly: true }).send({ accessToken });
		}
		catch (error) {
			next(error);
		}
	}

	refreshToken = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const refreshToken = req.cookies["refreshToken"];
			if (!refreshToken) throw new createHttpError.BadRequest();

			const payload = await verifyRefreshToken(refreshToken);
			const redisRefToken = await RedisHelper.client.get(payload.aud);
			const user = await User.findById(payload.aud);

			if (redisRefToken !== refreshToken || !user) {
				await RedisHelper.client.del(payload.aud);
				res.clearCookie("refreshToken");
				throw new createHttpError.Unauthorized();
			}

			const accessToken = await signAccessToken(payload.aud, { role: user.role });
			const newRefToken = await signRefreshToken(payload.aud);
			await RedisHelper.client.set(payload.aud, newRefToken, { EX: 365 * 24 * 60 * 60 });

			res.cookie("refreshToken", newRefToken, { httpOnly: true }).send({ accessToken });
		}
		catch (error) {
			next(error);
		}
	}

	logout = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const refreshToken = req.cookies["refreshToken"];
			if (!refreshToken) throw new createHttpError.BadRequest();

			const payload = await verifyRefreshToken(refreshToken);
			await RedisHelper.client.del(payload.aud);

			res.clearCookie("refreshToken").send({ message: "Logged out successfully." });
		}
		catch (error) {
			next(error);
		}
	}
}

export default AuthRouter;