import { Dispatch, MiddlewareAPI } from '@reduxjs/toolkit';

const LoggerMiddleware = (store: MiddlewareAPI) => (dispatch: Dispatch) => (action: any) => {
	console.log('dispatching', action);
	return dispatch(action);
}

export default LoggerMiddleware;