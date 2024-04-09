// fileSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const fileSlice = createSlice({
	name: "files",
	initialState: {
		files: [], // Array of file objects
	},
	reducers: {
		setFiles: (state, action) => {
			state.files = action.payload;
		},

		// const dummyConversionStatus = [
		// 	{
		// 		fileName: "test-1704177746452",
		// 		stage: "loading",
		// 		status: "in-progress",
		// 	},
		// 	// Add more dummy conversion statuses as needed
		// ];

		updateConversionStatus: (state, action) => {
			const { fileName, stage, status } = action.payload;
			const fileToUpdate = state.files.find(
				(file) => file.name === fileName
			);
			fileToUpdate.conversionStatus[stage] = status;
		},
		removeFile: (state, action) => {
			const fileName = action.payload;
			state.files = state.files.filter((file) => file.name !== fileName);
		},
	},
});

export const { setFiles, updateConversionStatus, removeFile } =
	fileSlice.actions;

// export const selectFiles = (state) => state.files.files;

export default fileSlice.reducer;
