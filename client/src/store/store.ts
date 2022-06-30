import { configureStore } from '@reduxjs/toolkit';
import LoggerMiddleware from './middleware/loggerMiddleware';
import { UserReducer } from './reducer/user';

const store = configureStore({
	reducer: {
		user: UserReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
		LoggerMiddleware
	])
});

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export default store;