import { Reducer } from "@reduxjs/toolkit";

export class UserState {
	isAuthenticated: boolean = false;
	authenticationStatusChecked: boolean = false;
	userDetailsAvailable: boolean = false;
	username: string = "";
	firstName: string = "";
	lastName: string = "";
	email: string = "";
	contactNumber: string = "";
}

export type UserAction =
	{ type: "USER_LOGGED_OUT" | "USER_AUTHENTICATED" } |
	{ type: "AUTHENTICATION_STATUS_CHECKED", isAuthenticated: boolean } |
	{ type: "USER_DETAILS_RECEIVED", username: string, firstName: string, lastName: string, email: string, contactNumber: string }

export const UserReducer: Reducer<UserState, UserAction> = (state: UserState = new UserState(), action: UserAction) => {

	switch (action.type) {
		case "USER_LOGGED_OUT":
			return {
				...new UserState(),
				authenticationStatusChecked: state.authenticationStatusChecked
			};
		case "USER_AUTHENTICATED":
			return {
				...state,
				isAuthenticated: true,
			}
		case "USER_DETAILS_RECEIVED":
			const { type, ...userDetails } = action;
			return {
				...state,
				userDetailsAvailable: true,
				...userDetails
			};
		case "AUTHENTICATION_STATUS_CHECKED":
			return {
				...state,
				authenticationStatusChecked: true,
				isAuthenticated: action.isAuthenticated
			};
		default:
			return state;
	}
}