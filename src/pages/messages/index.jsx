import { useContext, useEffect, useState } from "react";

import { format } from "date-fns";
import { File } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { SocketContext } from "../../contexts/socketContext";
import useApi from "../../lib/useApi";

const Message = ({ self, body, media, time }) => {
	return (
		<div className={`flex ${self ? "justify-end" : "justify-start"}`}>
			<div className="flex flex-col items-end min-w-[20%] max-w-[80%] ">
				<p
					className={`w-full px-5 py-3 rounded-lg ${
						self ? "bg-background-0/80" : "bg-background-0/60"
					} text-black/85 select-text backdrop-blur-xl`}
				>
					{body}
				</p>
				<span className="text-xs">{format(new Date(time), "HH:mm")}</span>
			</div>
		</div>
	);
};

const Messages = ({ messages, currentUser }) => {
	const allMessages = messages.slice();
	allMessages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
	return (
		<div className="absolute top-0 bottom-0 left-0 right-0 p-4">
			<div className="custom-scrollbar w-full h-full flex flex-col-reverse overflow-y-auto">
				{/* <div className=""> */}
				<div className="flex flex-col justify-end gap-3">
					{allMessages.map(({ _id, author, body, time }, index) => (
						<Message key={_id} self={author.user == currentUser.user} body={body} time={time} />
					))}
				</div>
				{/* </div> */}
			</div>
		</div>
	);
};

const MessageBox = ({ room, updateMessages }) => {
	const socket = useContext(SocketContext);

	const { register, handleSubmit, reset } = useForm();

	const onSubmit = async (data) => {
		console.log({ data });
		socket.emit("message", { room, body: data.body }, (message, err) => {
			if (err) console.error(err);
			else {
				console.info(message);
				updateMessages(message);
				reset();
			}
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="shrink-0 flex gap-4 p-4 w-full">
			<textarea
				type="text"
				{...register("body", { required: true })}
				className="grow resize-none h-fit max-h-80 px-4 py-3 border rounded-md border-primary-default text-sm"
				placeholder="Send a message..."
			/>
			<button className="px-4 py-2 rounded-md text-sm font-semibold bg-gradient-primary text-white">
				Send
			</button>
		</form>
	);
};

export const Chat = ({}) => {
	const location = useLocation();
	const [room, setRoom] = useState(null);
	const [messages, setMessages] = useState([]);
	const api = useApi(true);

	const socket = useContext(SocketContext);

	const updateMessages = (newMessage) => setMessages((curr) => [...curr, newMessage]);
	const onNewMessage = (message, err) => {
		if (err) console.error(err);
		else {
			updateMessages(message);
		}
	};

	useEffect(() => {
		const roomId = location.pathname.split("/")[2].split(/[^\w]/g)[0];
		api.post("/chat/room", { room: roomId }).then((data) => {
			setRoom(data);
		});
	}, [location]);

	useEffect(() => {
		if (!room) return;
		setMessages(room.messages);
		socket.on("message:" + room._id, onNewMessage);
		return () => socket.off("message:" + room._id, onNewMessage);
	}, [room]);

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col min-h-full max-h-full p-4 overflow-hidden">
			{room ? (
				<>
					<div className="relative grow">
						<Messages messages={messages} currentUser={room.currentUser} />
					</div>
					<MessageBox room={room._id} updateMessages={updateMessages} />
				</>
			) : null}
		</div>
	);
};

const Room = ({ _id, users, currentUser, otherUsers, lastMessage }) => {
	if (!otherUsers && !otherUsers.length) return <></>;

	const uIndex = users.findIndex(({ _id }) => _id == otherUsers[0].user);
	const user = users[uIndex];

	return (
		<NavLink
			to={_id}
			className={({ isActive }) => `flex gap-4 px-4 py-3 ${isActive ? "bg-background-200" : ""}`}
			state={{ room: { _id, currentUser, otherUser: user } }}
		>
			<div className="shrink-0 w-14 h-14 border-primary-default rounded-full overflow-hidden">
				<img
					src={user.avatar ? "/" + user.avatar : "https://randomuser.me/api/portraits/lego/1.jpg"}
					alt={user.name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow min-w-[1px] flex flex-col justify-center">
				<p className="text-lg font-medium" title={user.name}>
					{user.name}
				</p>
				{lastMessage ? (
					<p
						className="text-sm font-light text-primary-washedout whitespace-nowrap max-w-full overflow-hidden overflow-ellipsis"
						title={lastMessage.body ? lastMessage.body : ""}
					>
						<span className="font-medium">
							{lastMessage.author.user == currentUser.user ? "You:" : ""}
						</span>{" "}
						{lastMessage.body ? (
							lastMessage.body
						) : (
							<span>
								<File /> File
							</span>
						)}
					</p>
				) : (
					<p className="text-base font-light text-primary-washedout italic">No messages yet</p>
				)}
			</div>
		</NavLink>
	);
};

export function Messaging() {
	const [rooms, setRooms] = useState(null);

	const api = useApi(true);
	useEffect(() => {
		api.post("/chat/rooms").then(setRooms).catch(console.error);
	});

	return (
		<main className="absolute top-0 left-0 right-0 bottom-0 flex min-h-full max-h-full min-w-[1px] bg-background-100">
			<div className="flex flex-col w-96 bg-background-0">
				{rooms ? (
					rooms.length ? (
						rooms.map((room) => <Room key={room._id} {...room} />)
					) : (
						<>No chats to display</>
					)
				) : (
					<>Loading...</>
				)}
			</div>
			<div className="relative grow min-h-full max-h-full bg-background-200">
				<Outlet />
			</div>
		</main>
	);
}
