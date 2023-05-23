import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import { faGlobe, faQuestionCircle, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useApi from "../lib/useApi";
import userAtom from "../state/user";

export default function PrivateRoute({ element: Component }) {
	const setUser = useSetRecoilState(userAtom);
	const [loading, setLoading] = useState(0);
	const navigate = useNavigate();
	const location = useLocation();

	const api = useApi(false);
	useEffect(() => {
		api
			.post("hr/auth/refresh", {
				refreshToken: localStorage.getItem("hrRefreshToken"),
			})
			.then(({ accessToken, refreshToken, user }) => {
				if (accessToken && refreshToken) {
					localStorage.setItem("hrAccessToken", accessToken);
					localStorage.setItem("hrRefreshToken", refreshToken);
					setUser((_) => user);
					setLoading(1);
				}
			})
			.catch(({ err: _error }) => {
				if (_error?.response?.status) {
					if (_error.response.status == 401) {
						navigate("/logout", { state: { redirect: location.pathname + "?" + location.search } });
						return;
					}
				}
				setLoading(_error?.response?.status || "unkown");
			});
		const interval = setInterval(() => {
			console.log("Refreshing tokens!");
			api
				.post("/hr/auth/refresh", {
					refreshToken: localStorage.getItem("hrRefreshToken"),
				})
				.then(({ accessToken, refreshToken }) => {
					if (accessToken && refreshToken) {
						localStorage.setItem("hrAccessToken", accessToken);
						localStorage.setItem("hrRefreshToken", refreshToken);
					}
				})
				.catch(({ err: _error }) => {
					if (_error.response?.status) {
						if (_error.response.status == 401) {
							navigate("/logout", {
								state: { redirect: location.pathname + "?" + location.search },
							});
							return;
						}
					}
					setLoading(_error.response?.status || "unkown");
				});
		}, 5 * 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	return loading == 0 ? (
		<div className="flex items-center justify-center h-screen w-screen text-4xl font-bold text-primary-default">
			Loading...
		</div>
	) : loading == 1 ? (
		Component
	) : (
		<div className="flex items-center justify-center h-screen w-screen p-10">
			<p className="text-4xl font-bold text-black">
				<FontAwesomeIcon icon={faWarning} className="mr-2 text-danger-default" /> Error connecting
				to server.
				<p className="flex items-center mt-6 text-3xl font-bold text-black">
					<FontAwesomeIcon icon={faGlobe} className="mr-4 text-4xl text-danger-default" /> Status
					code: {loading}
				</p>
				<p className="flex items-center mt-6 text-xl font-medium">
					<FontAwesomeIcon icon={faQuestionCircle} className="mr-4 text-4xl text-danger-default" />
					Try reaching out at:{"  "}
					<a href="mailto:connect@lernx.in" className="text-blue-700 underline">
						connect@lernx.in
					</a>
				</p>
			</p>
		</div>
	);
}
