import { Reducer } from "@reduxjs/toolkit";

export class UserState {
	isAuthenticated: boolean = false;
	firstName: string = "";
	lastName: string = "";
}

export type UserAction =
	{ type: "XYZ" }

export const UserReducer: Reducer<UserState, UserAction> = (state: UserState = new UserState(), action: UserAction) => {
	switch (action.type) {
		default:
			return state;
	}
}