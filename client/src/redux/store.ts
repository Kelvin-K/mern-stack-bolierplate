import { configureStore } from '@reduxjs/toolkit';
import LoggerMiddleware from './middleware/loggerMiddleware';
import authReducer from "./slice/auth";
import userReducer from './slice/user';

const store = configureStore({
	reducer: {
		user: userReducer,
		auth: authReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
		LoggerMiddleware
	])
});

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export default store;