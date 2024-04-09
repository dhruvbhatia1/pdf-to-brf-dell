import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
	name: "app",
	initialState: false,
	reducers: {
		refreshStatus: (state) => !state,
	},
});

export const { refreshStatus } = appSlice.actions;
export default appSlice.reducer;
