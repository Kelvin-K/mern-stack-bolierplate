import * as jwt from "jsonwebtoken";

//using require('crypto').randomBytes(64).toString('hex')
const authTokenHash = '86e9d7ba07f6a646f2dbaa24c655267bc655ece34619dc5b07b7495c706a6c37f1b3935fdf91b64dbbd173ef59cb716690a4cd6225876c0dc2945296ffb2f8fd';
const refreshTokenHash = 'c0b38bb3182b438b79a660b39e9eae91f0e6ae548c93c878bbfdcafa04fd786441d6ea23ff3059720d8061df4c379655e9c26db95a43429f60d495a1dc3984ed';

export const encodeContent = (data: any, key: string): string =>
	jwt.sign({ ...data, iat: Date.now() }, key);

export const decodeContent = (data: string, key: string): any =>
	jwt.verify(data, key);

export const getAuthToken = (data: any, key: string = authTokenHash): string =>
	encodeContent(data, key);

export const parseAuthToken = (token: any, key: string = authTokenHash): any =>
	decodeContent(token, key);

export const getRefreshToken = (data: any, key: string = refreshTokenHash): string =>
	encodeContent(data, key);

export const parseRefreshToken = (token: any, key: string = refreshTokenHash): any =>
	decodeContent(token, key);