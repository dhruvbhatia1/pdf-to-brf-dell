import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ref, deleteObject } from "firebase/storage";
import { Link } from "react-router-dom";
import { db, storage } from "../utils/firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { refreshStatus } from "../utils/appSlice";

const FileStatusRow = ({ file }) => {
	const auth = getAuth();
	const userId = auth.currentUser ? auth.currentUser.uid : null;
	const [language, setLanguage] = useState("English");
	const [loading, setLoading] = useState(false);
	const [isConversionInProgress, setIsConversionInProgress] = useState(false);
	const dispatch = useDispatch();

	const handleLanguageChange = (language) => {
		setLanguage(language);
	};

	const handleDelete = async (file) => {
		try {
			setLoading(true);
			const fileRef = ref(storage, `${userId}/pdf/${file.uniqueFileName}`);
			await deleteObject(fileRef);
			console.log("PDF File deleted from storage");
			// if (file.wordDownloadURL) {
			// 	const wordFileRef = ref(
			// 		storage,
			// 		`${userId}/word/${file.uniqueFileName}`
			// 	);
			// 	await deleteObject(wordFileRef);
			// 	console.log("Word File deleted from storage");
			// }

			// if (file.brailleDownloadURL) {
			// 	const brailleFileRef = ref(
			// 		storage,
			// 		`${userId}/braille/${file.uniqueFileName}`
			// 	);
			// 	await deleteObject(brailleFileRef);
			// 	console.log("Braille File deleted from storage");
			// }
			await deleteDoc(doc(db, userId, file.id));
			console.log("Metadata deleted from Firestore");
			dispatch(refreshStatus());
		} catch (error) {
			console.error("Error deleting file from storage:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleConversionStart = async (fileId) => {
		const fileRef = doc(db, userId, fileId);
		const fileData = {
			wordConversionStatus: "in-progress",
			brailleConversionStatus: "in-progress",
			language: language,
		};
		await updateDoc(fileRef, fileData);
		console.log("Word conversion started");
		setTimeout(async () => {
			const fileData = {
				wordDownloadURL:
					"https://firebasestorage.googleapis.com/v0/b/pdf-to-braille.appspot.com/o/SxeOZyQk6DQQo5pkOv0lxJYQOOl2%2Ftest2.docx?alt=media&token=53a2c18b-9896-49b2-beb9-075db250262b",
				wordConversionStatus: "completed",
			};
			await updateDoc(fileRef, fileData);
		}, 76000);
		setTimeout(async () => {
			const fileData = {
				brailleDownloadURL:
					"https://firebasestorage.googleapis.com/v0/b/pdf-to-braille.appspot.com/o/SxeOZyQk6DQQo5pkOv0lxJYQOOl2%2Fbraille.docx?alt=media&token=72ced6c5-5d34-463f-94d1-e67ef42439cf",
				brailleConversionStatus: "completed",
			};
			await updateDoc(fileRef, fileData);
		}, 210000);

		fetchFileStatus();
		setIsConversionInProgress(true);
	};

	return (
		<tr key={file.id} className="text-center">
			<td className="py-2 px-4 border-b">
				{loading ? (
					<CircularProgress color="inherit" size={20} />
				) : (
					<button
						onClick={() => handleDelete(file)}
						className="text-red-500 hover:text-red-700"
					>
						<DeleteIcon />
					</button>
				)}
			</td>
			<td className="py-2 px-4 border-b">
				<Link
					to={file.pdfDownloadURL}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-500 hover:underline"
				>
					{file.originalFileName}
				</Link>
			</td>
			<td className="py-2 px-4 border-b">
				{file.wordDownloadURL ? (
					<Link to={file.wordDownloadURL}>
						Download <FileDownloadIcon />
					</Link>
				) : (
					<span>
						{(() => {
							switch (file.wordConversionStatus) {
								case "pending":
									return "pending";
								case "in-progress":
									return <CircularProgress size={20} />;
								case "completed":
									return "Conversion is completed";
								case "failed":
									return (
										<>
											Failed <ErrorOutlineIcon />
										</>
									);
								default:
									return "Unknown conversion status";
							}
						})()}
					</span>
				)}
			</td>
			<td className="py-2 px-4 border-b">
				{file.brailleDownloadURL ? (
					<Link to={file.brailleDownloadURL}>
						Download <FileDownloadIcon />
					</Link>
				) : (
					<span>
						{(() => {
							switch (file.brailleConversionStatus) {
								case "pending":
									return "pending";
								case "in-progress":
									return <CircularProgress size={20} />;
								case "completed":
									return "Conversion is completed";
								case "failed":
									return (
										<>
											Failed <ErrorOutlineIcon />
										</>
									);
								default:
									return "Unknown conversion status";
							}
						})()}
					</span>
				)}
			</td>
			<td className="py-2 px-4 border-b">
				<select
					value={language || "English"}
					onChange={(e) => handleLanguageChange(e.target.value)}
					className="rounded-md border border-gray-300 px-2 py-1 focus:outline-none bg-inherit"
				>
					<option value="English" style={{ fontWeight: "bold" }}>
						English (Default)
					</option>
					<option value="Hindi">Hindi</option>
					<option value="Telugu">Telugu</option>
				</select>
			</td>
			<td className="py-2 px-4 border-b">
				<button
					onClick={() => handleConversionStart(file.id)}
					className="text-[#0063b8] font-bold py-1 px-2 mr-2 border border-[#549bd2] rounded-md hover:bg-[#d9f5fd]"
					disabled={isConversionInProgress}
				>
					{!isConversionInProgress ? "Start Conversion" : "Converting..."}
				</button>
			</td>
		</tr>
	);
};

export default FileStatusRow;
