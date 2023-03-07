import { createAction } from '@reduxjs/toolkit';

export const authenticationStatusChanged = createAction<boolean>("AUTH_STATUS_CHANGED");