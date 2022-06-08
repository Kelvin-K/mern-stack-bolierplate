import { configureStore } from '@reduxjs/toolkit';
import LoggerMiddleware from './middlewares/loggerMiddleware';
import { UserReducer } from './reducers/user';

const store = configureStore({
	reducer: {
		user: UserReducer
	},
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware(),
		LoggerMiddleware
	]
});

(window as any).store = store;
export type RootState = ReturnType<typeof store.getState>

export default store;