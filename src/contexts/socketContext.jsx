import { createContext } from "react";

import { io } from "socket.io-client";

const socket = io({
	autoConnect: true,
	reconnectionDelayMax: 10000,
	auth: (cb) => cb({ token: localStorage.getItem("hrAccessToken") }),
	rejectUnauthorized: false,
	transports: ["websocket"],
});

socket.on("connect_error", function (err) {
	console.log("connect_error due to: " + err.message);
	if (err.message == "Token expired!") {
		socket.connect();
	}
});

socket.on("connect", function () {
	console.info("connected: " + socket.connected);
});

// setInterval(() => console.log(socket.connected), 2000);

export const SocketContext = createContext(socket);

const SocketProvider = ({ children }) => (
	<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);

export default SocketProvider;
