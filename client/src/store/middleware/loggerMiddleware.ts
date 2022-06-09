const LoggerMiddleware = (store: any) => (next: any) => (action: any) => {
	console.log('dispatching', action);
	return next(action);
}

export default LoggerMiddleware;