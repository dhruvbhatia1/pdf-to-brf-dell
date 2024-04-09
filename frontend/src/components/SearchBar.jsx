import React, { useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch } from "react-redux";
import { refreshStatus } from "../utils/appSlice";

const SearchBar = ({ searchQuery, onSearchChange }) => {
	const dispatch = useDispatch();

	// refresh every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			dispatch(refreshStatus());
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex items-center mb-4">
			<input
				type="text"
				placeholder="Search files..."
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				className="bg-gray-200 placeholder-gray-800 border rounded-md py-2 px-4 mr-2 focus:outline-none focus-within:ring-2 focus-within:ring-black"
			/>
			<SearchIcon className="text-gray-500" />
			<RefreshIcon
				className="mx-10 text-gray-800 cursor-pointer hover:text-gray-500"
				onClick={() => dispatch(refreshStatus())}
			/>
		</div>
	);
};

export default SearchBar;
