import "react-toastify/dist/ReactToastify.min.css";

import { createContext, useContext, useEffect } from "react";

import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { SocketContext } from "./socketContext";

export const NotificationContext = createContext();

const MessageNotification = ({ room, author: { name, avatar }, body, closeToast }) => {
	return (
		<NavLink
			to={"/messaging/" + room}
			className={`flex gap-4 max-w-full bg-background-0`}
			onClick={closeToast}
		>
			<div className="shrink-0 w-14 h-14 border-primary-default rounded-full overflow-hidden">
				<img
					src={avatar ? "/" + avatar : "https://randomuser.me/api/portraits/lego/1.jpg"}
					alt={name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow min-w-[1px] flex flex-col justify-center">
				<p className="text-lg font-medium" title={name}>
					{name}
				</p>
				<p
					className="text-sm font-light text-primary-washedout whitespace-nowrap max-w-full overflow-hidden overflow-ellipsis"
					title={body ? body : ""}
				>
					{body ? body : <span>New message</span>}
				</p>
			</div>
		</NavLink>
	);
};

const NotificationProvider = ({ children }) => {
	const socket = useContext(SocketContext);
	const onNotification = (notification) => {
		console.log(notification);
		switch (notification.type) {
			case "message":
				console.log(toast.isActive(notification.data.room));
				if (toast.isActive(notification.data.room))
					toast.update(notification.data.room, {
						render: ({ closeToast }) => (
							<MessageNotification {...notification.data} closeToast={closeToast} />
						),
					});
				else
					toast(
						({ closeToast }) => (
							<MessageNotification {...notification.data} closeToast={closeToast} />
						),
						{
							toastId: notification.data.room,
						}
					);
				break;
		}
	};

	useEffect(() => {
		socket.on("notification", onNotification);

		return () => {
			socket.off("notification", onNotification);
		};
	}, []);

	return (
		<NotificationContext.Provider value={null}>
			{children}
			<ToastContainer
				position="bottom-right"
				className="!w-96"
				bodyClassName={"max-w-[calc(100%_-_14px)]"}
				toastClassName={"max-w-full"}
				autoClose={false}
			/>
		</NotificationContext.Provider>
	);
};

export default NotificationProvider;
