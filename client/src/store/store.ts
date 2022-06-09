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

(window as any).store = store;
export type RootState = ReturnType<typeof store.getState>

export default store;