import express, { Request, Response, Router } from "express";
import HttpStatusCodes from 'http-status-codes';
import User from "../db/user";
import AuthenticationMiddleware from "../middleware/authenticationMiddleware";
import { getAuthToken, getRefreshToken, parseRefreshToken } from './../helper/authenticationHelper';

class AuthenticateRoute {
	router: Router;
	constructor() {
		this.router = express.Router();
		this.router.post("/", this.getAuthenticateRoute);
		this.router.post("/status", this.authenticationStatus);
		this.router.post("/refresh-token", this.refreshToken);
		this.router.post("/logout", AuthenticationMiddleware, this.deAuthenticate);
	}

	getAuthenticateRoute = async (req: Request, res: Response) => {
		const body = req.body;
		const user = await User.findOne({ username: body.username });
		if (!user) {
			res.status(HttpStatusCodes.NOT_FOUND).send({ message: "Username not found." });
			return;
		}
		let { error, isMatch } = await user.validatePassword(body.password);
		if (error) {
			res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Error validating password." });
			return;
		}
		if (!isMatch) {
			res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "Invalid credential." });
			return;
		}
		const authToken = getAuthToken({ id: user.id });
		const refreshToken = getRefreshToken({ id: user.id });

		await user.updateOne({ refreshToken });

		res.cookie("refreshToken", refreshToken, { httpOnly: true })
			.status(200)
			.send({
				authToken,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				contactNumber: user.contactNumber
			});
	}

	authenticationStatus = async (req: Request, res: Response) => {
		const oldRefreshToken = req.cookies.refreshToken;
		if (!oldRefreshToken) {
			res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid request" });
			return;
		}
		const content = parseRefreshToken(oldRefreshToken);
		if (!content || !content.id || !content.iat) {
			res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid request" });
			return;
		}
		const user = await User.findById(content.id);
		if (!user) {
			res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid user" });
			return;
		}
		const tokenDurationInDays = Math.ceil((content.iat - Date.now()) / (1000 * 60 * 60 * 24));
		if (tokenDurationInDays > 1) {
			if (user.refreshToken === oldRefreshToken) {
				await user.updateOne({ refreshToken: "" });
			}
			res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "session expired" });
			return;
		}

		const authToken = getAuthToken({ id: user.id });
		const refreshToken = getRefreshToken({ id: user.id });

		await user.updateOne({ refreshToken: refreshToken });

		res.cookie("refreshToken", refreshToken, { httpOnly: true })
			.status(200)
			.send({
				authToken,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				contactNumber: user.contactNumber
			});
	}

	refreshToken = async (req: Request, res: Response) => {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) {
			res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid request" });
			return;
		}
		const content = parseRefreshToken(refreshToken);
		if (!content || !content.id || !content.iat) {
			res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid request" });
			return;
		}
		const user = await User.findById(content.id);
		if (!user) {
			res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid user" });
			return;
		}
		const tokenDurationInDays = Math.ceil((content.iat - Date.now()) / (1000 * 60 * 60 * 24));
		if (tokenDurationInDays > 1) {
			if (user.refreshToken === refreshToken) {
				await user.updateOne({ refreshToken: "" });
			}
			res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "session expired" });
			return;
		}
		const authToken = getAuthToken({ id: user.id });
		res.status(200).send({ authToken });
	}

	deAuthenticate = (req: Request, res: Response) => {
		(req as any).user.updateOne({ refreshToken: "" });
		res.clearCookie("refreshToken");
		res.status(200).send({ message: "Successfully unauthenticated." });
	}
}

export default AuthenticateRoute;