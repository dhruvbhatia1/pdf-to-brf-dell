import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import FileStatusRow from "./FileStatusRow";

const FileStatus = () => {
	const auth = getAuth();
	const userId = auth.currentUser ? auth.currentUser.uid : null;
	const [fileStatus, setFileStatus] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const refresh = useSelector((state) => state.app);

	useEffect(() => {
		// Fetch file status when the component mounts
		fetchFileStatus();
	}, [refresh]);

	const fetchFileStatus = async () => {
		if (userId) {
			try {
				const userFilesSnapshot = await getDocs(collection(db, userId));
				const filesData = userFilesSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setFileStatus(filesData);
			} catch (error) {
				console.error("Error fetching file status:", error);
			}
		}
	};

	const filterFiles = () => {
		return fileStatus.filter((file) =>
			file.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())
		);
	};

	return (
		<div className="mt-8 container mx-auto p-4">
			<h2 className="text-3xl font-bold mb-4">File Status</h2>
			<SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
					<thead className="bg-gray-300">
						<tr>
							<th></th>
							<th className="py-2 px-4 border-b text-center">File Name</th>
							<th className="py-2 px-4 border-b text-center">
								Word Conversion
							</th>
							<th className="py-2 px-4 border-b text-center">BRF Conversion</th>
							<th className="py-2 px-4 border-b text-center">Language</th>
							<th className="py-2 px-4 border-b text-center">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-gray-200 shadow-inner">
						{filterFiles() && filterFiles().length > 0 ? (
							filterFiles().map((file) => (
								<FileStatusRow key={file.id} file={file} />
							))
						) : (
							<tr>
								<td
									colSpan="6"
									className="text-center py-4 px-4 border-b text-gray-500"
								>
									No files found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default FileStatus;
