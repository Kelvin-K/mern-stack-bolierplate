import { NextFunction, Request, Response } from 'express';

const LoggingMiddleWare = (req: Request, res: Response, next: NextFunction) => {
	console.log(`${req.method} ${req.path}`);
	next();
}

export default LoggingMiddleWare;