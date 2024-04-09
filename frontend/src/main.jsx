import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import "./index.css";
import Body from "./components/Body";
import MainBody from "./components/MainBody";
import Editor from "./components/Editor";
import Login from "./components/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const appRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Login />,
			},
			{
				path: "/home",
				element: <Body />,
				children: [
					{
						path: "/home",
						element: <MainBody />,
					},
					{
						path: "/home/edit/:id",
						element: <Editor />,
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={appRouter} />
	</React.StrictMode>
);
