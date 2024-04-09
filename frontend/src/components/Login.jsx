import React, { useRef, useState } from "react";
import Header from "./Header";
import { checkValidData } from "../utils/validate";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import TextField from "@mui/material/TextField";
import "../styles/Login.css";

const Login = () => {
	const [isSignInForm, setIsSignInForm] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);
	const dispatch = useDispatch();
	const name = useRef(null);
	const email = useRef(null);
	const password = useRef(null);

	const handleButtonClick = () => {
		// validate the form data
		const message = checkValidData(email.current.value, password.current.value);
		setErrorMessage(message);
		if (message) return;
		// sign in or sign up logic
		if (!isSignInForm) {
			// Sign Up
			createUserWithEmailAndPassword(
				auth,
				email.current.value,
				password.current.value
			)
				.then((userCredential) => {
					// Signed in
					const user = userCredential.user;
					updateProfile(user, {
						displayName: name.current.value,
					})
						.then(() => {
							// Profile updated!
							const { uid, email, displayName } = auth.currentUser;
							dispatch(
								addUser({
									uid: uid,
									email: email,
									displayName: displayName,
								})
							);
						})
						.catch((error) => {
							// An error occurred
							setErrorMessage(error.message);
						});
					// console.log(user);

					// ...
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					setErrorMessage(errorCode + " - " + errorMessage);
					// ..
				});
		} else {
			// Sign In
			signInWithEmailAndPassword(
				auth,
				email.current.value,
				password.current.value
			)
				.then((userCredential) => {
					// Signed in
					// const user = userCredential.user;
					// console.log(user);
					// ...
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					setErrorMessage(errorCode + " - " + errorMessage);
				});
		}
	};

	const toggleSignInForm = () => {
		setIsSignInForm(!isSignInForm);
	};
	return (
		<div>
			<Header />
			<div>
				<form
					onSubmit={(e) => e.preventDefault()}
					className="w-11/12 md:w-6/12 lg:w-4/12 px-12 py-6 my-16 mx-auto bg-white bg-opacity-80 text-black border border-black rounded-lg shadow-lg"
				>
					<h1 className="text-center text-2xl md:text-3xl py-4">
						{isSignInForm ? "Sign In" : "Sign Up"}
					</h1>
					{!isSignInForm && (
						<TextField
							inputRef={name}
							label="Full Name"
							variant="outlined"
							fullWidth
							margin="normal"
						/>
					)}
					<TextField
						inputRef={email}
						required
						label="Email Address"
						variant="outlined"
						fullWidth
						margin="normal"
						type="email"
					/>
					<TextField
						inputRef={password}
						required
						label="Password"
						variant="outlined"
						fullWidth
						margin="normal"
						type="password"
					/>
					<p className="text-red-500 font-semibold">{errorMessage}</p>
					<button
						className="p-4 my-6 w-full text-white text-lg bg-[#0076ce] hover:bg-[#0063b8] rounded-lg"
						onClick={handleButtonClick}
					>
						{isSignInForm ? "Sign In" : "Sign Up"}
					</button>
					{isSignInForm ? (
						<p>
							Don't have an account?{" "}
							<span
								className="py-4 cursor-pointer hover:underline text-[#0063b8]"
								onClick={toggleSignInForm}
							>
								Create an account
							</span>
						</p>
					) : (
						<p>
							Already have an account?{" "}
							<span
								className="py-4 cursor-pointer hover:underline text-[#0063b8]"
								onClick={toggleSignInForm}
							>
								Sign In
							</span>
						</p>
					)}
				</form>
			</div>
		</div>
	);
};

export default Login;
