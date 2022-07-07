import createError from 'http-errors';
import * as jwt from "jsonwebtoken";

//using require('crypto').randomBytes(64).toString('hex')
const accessTokenSecret = '86e9d7ba07f6a646f2dbaa24c655267bc655ece34619dc5b07b7495c706a6c37f1b3935fdf91b64dbbd173ef59cb716690a4cd6225876c0dc2945296ffb2f8fd';
const refreshTokenSecret = 'c0b38bb3182b438b79a660b39e9eae91f0e6ae548c93c878bbfdcafa04fd786441d6ea23ff3059720d8061df4c379655e9c26db95a43429f60d495a1dc3984ed';


export const signToken = (userId: any, secret: string, timeOut: string): Promise<string> =>
	new Promise((resolve, reject) => {
		const payload = {};
		const options = {
			expiresIn: timeOut,
			issuer: "mern-stack-boilerplate",
			audience: userId
		}
		jwt.sign(payload, secret, options, (err, token) => {
			if (err) {
				return reject(new createError.InternalServerError());
			}
			resolve(token!);
		});
	});

export const signAccessToken = (userId: any, secret: string = accessTokenSecret) =>
	signToken(userId, secret, "15s");

export const signRefreshToken = (userId: any, secret: string = refreshTokenSecret) =>
	signToken(userId, secret, "1y");



export const verifyToken = (token: string, secret: string): Promise<any> =>
	new Promise((resolve, reject) => {
		jwt.verify(token, secret, (error, payload) => {
			if (error) {
				console.log(error);
				const message = error.name === "JsonWebTokenError" ? "Unauthorized" : error.message;
				return reject(new createError.Unauthorized(message));
			}
			resolve(payload);
		});
	});

export const verifyAccessToken = (token: any, secret: string = accessTokenSecret) =>
	verifyToken(token, secret);

export const verifyRefreshToken = (token: any, secret: string = refreshTokenSecret) =>
	verifyToken(token, secret);