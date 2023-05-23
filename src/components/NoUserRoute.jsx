import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { userSelector } from "../state/auth";

export default function NoUserRoute({ element: Component }) {
	const user = useRecoilValue(userSelector);

	return !user ? Component : <Navigate to={"/"} replace={false} />;
}
