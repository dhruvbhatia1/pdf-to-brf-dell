import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storage, db } from "../utils/firebase";
import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch } from "react-redux";
import { refreshStatus } from "../utils/appSlice";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Toaster, toast } from "react-hot-toast";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const UploadForm = () => {
	const [files, setFiles] = useState(null);
	const [msg, setMsg] = useState(null);
	const [reset, setReset] = useState(false);
	const [fileNames, setFileNames] = useState([]);
	const [loading, setLoading] = useState(false);
	const auth = getAuth();
	const dispatch = useDispatch();

	const handleUpload = async (e) => {
		e.preventDefault();

		if (!files) {
			setMsg("No file selected");
			return;
		}

		const user = auth.currentUser;
		const userId = user ? user.uid : "defaultUserId";

		const userFolderRef = ref(storage, `${userId}/pdf`);

		try {
			setLoading(true); // Set loading state
			setMsg("Uploading...");
			const uploadingToast = toast.loading("Uploading");
			await uploadBytes(userFolderRef, null);

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const uniqueFileName = `${file.name}-${uuidv4()}`;
				const fileRef = ref(userFolderRef, uniqueFileName);

				await uploadBytes(fileRef, file);

				const downloadURL = await getDownloadURL(fileRef);
				console.log("File uploaded. Download URL:", downloadURL);

				const metadataDocRef = await addDoc(collection(db, userId), {
					userId,
					originalFileName: file.name,
					uniqueFileName,
					pdfDownloadURL: downloadURL,
					wordConversionStatus: "pending", // "pending", "in-progress", "completed", "failed"
					wordDownloadURL: null,
					brailleConversionStatus: "pending", // "pending", "in-progress", "completed", "failed"
					brailleDownloadURL: null,
					timestamp: Date.now(),
				});
				console.log("Metadata stored in Firestore with ID:", metadataDocRef.id);
			}

			setMsg(`Upload successful for user ${userId}`);
			dispatch(refreshStatus());
			setReset(true);
			toast.remove(uploadingToast);
			toast.success("Upload successful");
		} catch (error) {
			setMsg("Upload failed. Please try again."); // Improved error message
			toast.remove();
			toast.error("Upload failed. Please try again.");
			console.error(error);
		} finally {
			setLoading(false); // Reset loading state
		}
	};

	const handleReset = () => {
		setFiles(null);
		setMsg(null);
		setFileNames([]);
		setReset(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setFiles(e.dataTransfer.files);
		const names = Array.from(e.dataTransfer.files).map((file) => file.name);
		setFileNames(names);
		setReset(false);
	};

	const handleFileInputChange = (e) => {
		setFiles(e.target.files);
		const names = Array.from(e.target.files).map((file) => file.name);
		setFileNames(names);
		setReset(false);
	};

	return (
		<div className="px-4 mt-4 bg-inherit">
			<Toaster />
			<form
				onSubmit={handleUpload}
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}
				className="max-w-2xl mx-auto"
			>
				<div className="flex items-center justify-center h-40 border-dashed border-2 bg-gray-200 border-gray-300 relative shadow-inner">
					<input
						type="file"
						onChange={handleFileInputChange}
						multiple
						className="hidden"
						id="fileInput"
					/>
					<label
						htmlFor="fileInput"
						className={`cursor-pointer w-full p-4 transition duration-300 ease-in-out rounded-md ${
							loading && "opacity-50 cursor-not-allowed"
						}`}
					>
						{fileNames.length > 0 ? (
							<>
								<ul className="pl-4 mt-2">
									{fileNames.map((fileName) => (
										<li key={fileName}>
											<PictureAsPdfIcon fontSize="inherit" className="mr-2" />
											{fileName}
										</li>
									))}
								</ul>
								<button
									type="button"
									onClick={handleReset}
									className="text-red-500 mt-2 hover:text-red-700 pl-3"
								>
									<DeleteIcon fontSize="small" />
								</button>
							</>
						) : (
							<p className="mb-2 p-2 text-gray-500">
								<CloudUploadIcon fontSize="small" className="mr-2" />
								Drag and drop PDF files here or click to browse.
							</p>
						)}
					</label>
				</div>
				{files && (
					<div className="mt-4 flex justify-end">
						{!reset && (
							<button
								type="submit"
								className={`bg-[#0076ce] hover:bg-[#0063b8] text-white font-bold py-2 px-4 rounded transition duration-100 ease-in-out ${
									loading && "opacity-50 cursor-not-allowed"
								}`}
								disabled={loading} // Disable the button during loading
							>
								{loading ? (
									"Uploading..."
								) : (
									<>
										<span>Upload</span>
										<FileUploadIcon />
									</>
								)}
							</button>
						)}
						{reset && (
							<button
								type="button"
								onClick={handleReset}
								className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-2 rounded transition duration-300 ease-in-out"
							>
								Reset
							</button>
						)}
					</div>
				)}
			</form>
			{console.log(msg)}
			{/* {msg && (
				<span
					className={`mt-2 block text-center ${
						msg.includes("failed") ? "text-red-600" : "text-green-600"
					}`}
				>
					{msg}
				</span>
			)} */}
		</div>
	);
};

export default UploadForm;
