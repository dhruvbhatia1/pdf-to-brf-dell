import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = auth.currentUser;

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in
				const { uid, email, displayName } = user;
				dispatch(
					addUser({
						uid: uid,
						email: email,
						displayName: displayName,
					})
				);
				navigate("/home");
			} else {
				// User is signed out
				dispatch(removeUser());
				navigate("/");
			}
		});

		return () => unsubscribe();
	}, []);

	const handleSignOut = () => {
		signOut(auth)
			.then(() => {
				// Sign-out successful.
			})
			.catch((error) => {
				navigate("/error");
			});
	};

	return (
		<header className="bg-white text-[#0076ce] py-4 px-4 flex justify-between items-center border-b shadow-2xl">
			<h1 className="text-3xl flex items-center font-medium italic">
				<Link to="/home" className="flex items-center">
					<img src="/logo.png" alt="Logo" className="mr-2 h-8 w-8" />
					PDF to BRF Converter
				</Link>
			</h1>
			{user && (
				<div className="flex items-center">
					<p className="mr-4">
						Welcome, {user.displayName ? user.displayName : user.email}!
					</p>
					<button
						onClick={handleSignOut}
						className="text-[#0063b8] py-1 px-2 border border-[#549bd2] rounded-sm hover:bg-[#d9f5fd]"
					>
						Sign Out <LogoutIcon />
					</button>
				</div>
			)}
		</header>
	);
};

export default Header;
