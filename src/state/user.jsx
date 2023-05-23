import { atom } from "recoil";

const userAtom = atom({
	key: "user",
	default: {
		id: "",
		name: "",
		email: "",
		avatar: "",
		company: "",
	},
});

export default userAtom;
