import {
  createContext,
  useEffect,
} from 'react';

import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { useFetchWrapper } from '../helpers/fetchWrapper';
import {
  accessTokenAtom,
  userAtom,
} from '../state/auth';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
	const [user, setUser] = useRecoilState(userAtom);
	const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);

	const fetchWrapper = useFetchWrapper();
	const navigate = useNavigate();

	useEffect(() => {
		fetchWrapper
			.post("/api/auth/refresh", {}, false)
			.then(({ accessToken }) => {
				setAccessToken(accessToken);
			})
			.catch((err) => {});

		setInterval(() => {
			fetchWrapper
				.post("/api/auth/refresh", {}, false)
				.then(({ accessToken }) => {
					setAccessToken(accessToken);
				})
				.catch((err) => {});
		}, 1000 * 60 * 10);
	}, []);

	useEffect(() => {
		if (!!accessToken) {
			if (!user) {
				fetchWrapper
					.get("/api/user", {})
					.then(({ user }) => setUser(user))
					.catch((err) => {
						if (err.response?.status == 500) {
						} else if (err.response?.status == 401) {
							navigate("/login");
						}
					});
			}
		}
	}, [accessToken]);
	return <AuthContext.Provider>{children}</AuthContext.Provider>;
};
