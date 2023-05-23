import {
  atom,
  selector,
} from "recoil";

const userAtom = atom({
	key: "userAtom",
	default: JSON.parse(localStorage.getItem("user")),
});

const userSelector = selector({
	key: "userSelector",
	get: ({ get }) => get(userAtom),
	set: ({ set }, newVal) => {
		console.log({ new: newVal });
		localStorage.setItem("user", JSON.stringify(newVal));
		set(userAtom, newVal);
	},
});

// const refreshTokenAtom = atom({
// 	key: "refreshTokenAtom",
// 	default: localStorage.getItem("hrRefreshToken"),
// });
// const refreshTokenSelector = selector({
// 	key: "refreshTokenSelector",
// 	get: ({ get }) => get(refreshTokenAtom),
// 	set: ({ set }, newVal) => {
// 		localStorage.setItem("hrRefreshToken", newVal);
// 		set(refreshTokenAtom, newVal);
// 	},
// });
// const accessTokenAtom = atom({
// 	key: "accessTokenAtom",
// 	default: localStorage.getItem("hrAccessToken"),
// });
// const accessTokenSelector = atom({
// 	key: "accessTokenSelector",
// 	get: ({ get }) => get(accessTokenAtom),
// 	set: ({ set }, newVal) => {
// 		localStorage.setItem("hrAccessToken");
// 		set(accessTokenAtom, newVal);
// 	},
// });

export { userSelector };
