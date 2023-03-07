import { createSlice } from "@reduxjs/toolkit";
import { authenticationStatusChanged } from "../actions/authActions";
import { userLoggedOut } from "../actions/userActions";

const initialState = {
    isAuthenticated: false,
}

const { reducer: AuthReducer } = createSlice({
    name: "Auth",
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(authenticationStatusChanged, (state, { payload }) => {
            state.isAuthenticated = payload;
        })

        builder.addCase(userLoggedOut, (state, action) => {
            state.isAuthenticated = false;
        });
    }
});

export default AuthReducer;
