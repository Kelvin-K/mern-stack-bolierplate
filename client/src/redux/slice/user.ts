import { createSlice } from "@reduxjs/toolkit";
import { userDetailsReceived, userLoggedOut } from "../actions/userActions";

const initialState = {
	username: "",
	firstName: "",
	lastName: "",
	email: "",
	contactNumber: "",
}

const { reducer: userReducer } = createSlice({
	name: "User",
	initialState,
	reducers: {

	},
	extraReducers: builder => {

		builder.addCase(userDetailsReceived, (state, { payload }) => {
			for (const key in payload) {
				const typedKey = key as keyof typeof payload;
				state[typedKey] = payload[typedKey];
			}
		});

		builder.addCase(userLoggedOut, (state, action) => {
			state = initialState;
		});
	}
})



export default userReducer;

