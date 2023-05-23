import { useLocation } from "react-router-dom";

import AppRoutes from "./routes";

function App() {
	const location = useLocation();
	return <AppRoutes />;
}

export default App;
