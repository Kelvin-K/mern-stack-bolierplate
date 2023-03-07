import { createAction } from '@reduxjs/toolkit';

export const userLoggedOut = createAction("USER_LOGGED_OUT");
export const userDetailsReceived = createAction<{ username: string, firstName: string, lastName: string, email: string, contactNumber: string }>("USER_DETAILS_RECEIVED");
