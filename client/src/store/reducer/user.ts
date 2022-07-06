import { Reducer } from "@reduxjs/toolkit";

export class UserState {
	isAuthenticated: boolean = false;
	username: string = "";
	firstName: string = "";
	lastName: string = "";
	email: string = "";
	contactNumber: string = "";
}

export type UserAction =
	{ type: "USER_LOGGED_OUT" } |
	{ type: "USER_AUTHENTICATED", username: string, firstName: string, lastName: string, email: string, contactNumber: string }

export const UserReducer: Reducer<UserState, UserAction> = (state: UserState = new UserState(), action: UserAction) => {
	switch (action.type) {
		case "USER_LOGGED_OUT":
			return new UserState();
		case "USER_AUTHENTICATED":
			const { username, firstName, lastName, email, contactNumber } = action;
			return {
				...state,
				isAuthenticated: true,
				username,
				firstName,
				lastName,
				email,
				contactNumber
			};
		default:
			return state;
	}
}