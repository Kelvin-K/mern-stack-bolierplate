import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { verifyAccessToken } from './../helper/jwtHelper';

const AuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers["authorization"];
		if (!authHeader) return next(new createHttpError.Unauthorized());

		const bearerToken = authHeader.split(" ");
		const token = bearerToken[1];

		req.payload = await verifyAccessToken(token);
		next();
	}
	catch (error) {
		next(error);
	}
}

export default AuthenticationMiddleware;