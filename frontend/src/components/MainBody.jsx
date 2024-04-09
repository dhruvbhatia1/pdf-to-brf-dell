import React from "react";
import UploadForm from "./UploadForm";
import FileStatus from "./FileStatus";
import Header from "./Header";

const MainBody = () => {
	return (
		<>
			<Header />
			<div
				className="mx-auto my-0 p-4 bg-gradient-to-br from-white to-gray-300
 shadow-lg"
			>
				<h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-center">
					Welcome to the realm of "Hand-Scanned PDFs to Braille Readable Format"
					– a journey of inclusivity, empowerment, and boundless possibilities.
				</h1>
				<p className="text-lg mb-8 text-gray-700 text-center">
					Our platform is dedicated to transforming scanned PDF documents into
					Braille Readable Format (BRF), ensuring accessibility for everyone.
					Join us on this empowering journey as we break down barriers and make
					information accessible to individuals with visual impairments.
				</p>
				<UploadForm />
				<FileStatus />
			</div>
		</>
	);
};

export default MainBody;
