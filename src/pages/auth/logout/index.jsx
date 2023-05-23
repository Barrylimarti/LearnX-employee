import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import { userSelector } from "../../../state/auth";

export default function Logout() {
	const setUser = useSetRecoilState(userSelector);
	const navigate = useNavigate();

	useEffect(() => {
		localStorage.removeItem("user");
		localStorage.removeItem("hrAccessToken");
		localStorage.removeItem("hrRefreshToken");
		setUser(null);
		navigate("/login");
	}, []);

	return null;
}
