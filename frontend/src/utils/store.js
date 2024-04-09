import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import userReducer from "./userSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		app: appReducer,
		// Add other reducers here if needed
	},
});