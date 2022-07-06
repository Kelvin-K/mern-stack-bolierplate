import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import User from '../db/user';
import { parseAuthToken } from './../helper/authenticationHelper';

const AuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader: any = req.headers['auth'];
	if (!authHeader) {
		res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid request" });
		return;
	}
	const [protocol, token] = authHeader.split(" ");
	if (protocol != "Bearer" || !token) {
		res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid request" });
		return;
	}
	const tokenDetails = parseAuthToken(token);
	if (!tokenDetails || !tokenDetails.id || !tokenDetails.iat) {
		res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid request" });
		return;
	}
	const tokenDuration = Math.ceil((tokenDetails.iat - Date.now()) / (1000 * 60 * 60 * 24));
	if (tokenDuration > 1) {
		res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "session expired" });
		return;
	}
	const user = await User.findById(tokenDetails.id);
	(req as any).user = user;
	next();
}

export default AuthenticationMiddleware;