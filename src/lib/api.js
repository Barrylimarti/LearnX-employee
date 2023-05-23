import axios from "axios";

const api = axios.create({
	baseURL: "/api",
});

api.interceptors.request.use(
	(config) => {
		if (config.requiresAuth) {
			const token = localStorage.getItem("hrAccessToken");
			if (token) config.headers["Authorization"] = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	async (response) => {
		return Promise.resolve(response);
	},
	async (error) => {
		if (error.response?.status == 401 && error.response?.data?.error == "access token expired") {
			try {
				const {
					data: { accessToken, refreshToken },
				} = await api.post("/hr/auth/refresh", {
					refreshToken: localStorage.getItem("hrRefreshToken"),
				});
				if (accessToken && refreshToken) {
					localStorage.setItem("hrAccessToken", accessToken);
					localStorage.setItem("hrRefreshToken", refreshToken);
					return api.request(error.config);
				}
			} catch (_error) {
				if (error.response?.status == 403) window.location = "/logout";
			}
		}
		return Promise.reject(error);
	}
);

export default api;
