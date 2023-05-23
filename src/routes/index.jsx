import { Outlet, useRoutes } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import SideBar from "../components/layout/SideBar";
import NoUserRoute from "../components/NoUserRoute";
import PrivateRoute from "../components/PrivateRoute";
import NotificationProvider from "../contexts/notificaionContext";
import SocketProvider from "../contexts/socketContext";
import CreateCompany from "../pages/auth/createCompany";
import Login from "../pages/auth/login";
import Forgot from "../pages/auth/login/forgot";
import Reset from "../pages/auth/login/reset";
import Logout from "../pages/auth/logout";
import Register from "../pages/auth/register";
import Dashboard from "../pages/dashboard";
import Jobs from "../pages/jobs";
import Candidates from "../pages/jobs/candidates";
import CreateJob from "../pages/jobs/create";
import JobInfo from "../pages/jobs/info";
import { Chat, Messaging } from "../pages/messages";

const MainApp = ({}) => {
	return (
		<SocketProvider>
			<NotificationProvider>
				<div className="relative flex">
					<SideBar />
					<div className="grow flex flex-col min-w-0">
						<Navbar className="shrink-0" />
						<div className="relative grow bg-background-100">
							<Outlet />
						</div>
					</div>
				</div>
			</NotificationProvider>
		</SocketProvider>
	);
};

export default function AppRoutes() {
	const element = useRoutes([
		{
			path: "login",
			element: <NoUserRoute element={<Outlet />} />,
			children: [
				{
					path: "",
					element: <Login />,
				},
				{
					path: "forgot",
					element: <Forgot />,
				},
				{
					path: "reset",
					element: <Reset />,
				},
			],
		},
		{
			path: "logout",
			element: <Logout />,
		},
		{
			path: "register",
			element: <NoUserRoute element={<Register />} />,
		},
		{
			path: "create-company",
			element: <CreateCompany />,
		},
		{
			path: "/",
			element: <PrivateRoute element={<MainApp />} />,
			children: [
				{
					path: "dashboard",
					element: <Dashboard />,
				},
				{
					path: "messaging",
					element: <Messaging />,
					children: [
						{
							path: ":room",
							element: <Chat />,
						},
					],
				},
				{
					path: "job",
					element: (
						<div className="bg-background-100">
							<Outlet />
						</div>
					),
					children: [
						{
							path: "",
							element: <Jobs />,
						},
						{
							path: "create",
							element: <CreateJob />,
						},
						{
							path: ":id",
							element: <Outlet />,
							children: [
								{
									path: "",
									element: <JobInfo />,
								},
								{
									path: "invite",
									element: <Candidates />,
								},
							],
						},
					],
				},
				{
					path: "*",
					element: (
						<div className="grow flex justify-center items-center">
							<h1 className="text-4xl font-bold text-primary-default">Coming soon...</h1>
						</div>
					),
				},
			],
		},
	]);

	return element;
}
