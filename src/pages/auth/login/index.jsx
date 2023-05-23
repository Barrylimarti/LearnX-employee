import { useState } from "react";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import BackgroundImage from "../../../assets/backgrounds/auth.svg";
import ButtonSideImage from "../../../assets/images/button-side.svg";
import SassyGirl from "../../../assets/sassy-girl/working-desk-with-background.svg";
import CheckBox from "../../../components/utils/CheckBox";
import useApi from "../../../lib/useApi";
import { userSelector } from "../../../state/auth";

export default function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [remember, setRemember] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();
	const [user, setUser] = useRecoilState(userSelector);
	const api = useApi();

	const onSubmit = async (data) => {
		const { error, accessToken, refreshToken, user } = await api.post("/hr/auth/login", data);
		if (!error) {
			setError(null);
			localStorage.setItem("hrAccessToken", accessToken);
			localStorage.setItem("hrRefreshToken", refreshToken);
			setUser((_) => user);
			navigate("/");
		} else {
			setError(error);
		}
	};

	return (
		<motion.div className="relative min-h-screen bg-[#091522]">
			<img className="absolute w-full h-full object-cover object-center" src={BackgroundImage} />
			<div className="absolute w-full h-full top-0 left-0 hidden lg:grid grid-cols-2">
				<div className="col-span-1"></div>
				<div className="col-span-1 rounded-tl-[4rem] border-l-[1px] border-t-[1px] border-white/30"></div>
			</div>
			<motion.div className="relative 2xl:container grid grid-cols-2 items-center min-h-screen mx-auto my-auto">
				<div className="hidden lg:block col-span-1">
					<div className="relative flex justify-center -top-24 scale-[1.2]">
						<img
							className="relative max-h-full max-w-full"
							src={SassyGirl}
							alt="sassy-girl-with-laptop"
						/>
					</div>
				</div>
				<div className="col-span-2 lg:col-span-1 p-16">
					<div className="relative top-12">
						<h1 className="text-5xl font-bold text-white">Welcome back 👋</h1>
						<h6 className="text-md text-gray-400 mt-8">
							Login with your credentials and start your journey with Heleum
						</h6>
						<div
							className="w-20 h-[4px] mt-6"
							style={{
								background: "linear-gradient(94.86deg, #F84857 22.09%, #C7096F 85.17%)",
							}}
						></div>
						{error ? (
							<div className="mt-6">
								<p className="text-danger-default">{error}</p>
							</div>
						) : null}

						<form className="mt-6" action="" onSubmit={handleSubmit(onSubmit)}>
							<div className="mb-6">
								<label className="inline-block text-white mb-2">Email Adress</label>
								<input
									type="email"
									className="bg-transparent text-white w-full px-5 py-4 border-2 border-white/30 rounded-[3rem]"
									placeholder="e.g. davon@mail.com"
									{...register("email", { required: true })}
								/>
							</div>
							<div className="mb-6">
								<label className="inline-block text-white mb-2">Password</label>
								<input
									type="password"
									className="bg-transparent text-white w-full px-5 py-4 border-2 border-white/30 rounded-[3rem]"
									placeholder="•••••••••••••••••"
									{...register("password", { required: true })}
								/>
							</div>

							<div className="mb-10 flex justify-between">
								<CheckBox
									defaultChecked={remember}
									label={<p className="text-white">Remember me</p>}
									colors={{ checked: "#e7325f" }}
									onChange={(checked) => {
										setRemember(checked);
									}}
								/>
								<a href="/login/forgot" className="text-sm text-gray-400">
									Forgot password?
								</a>
							</div>
							<div className="mb-10 grid grid-cols-2 items-center">
								<div className="col-span-1">
									<motion.button
										className="w-full px-10 py-4 rounded-[3rem] font-semibold text-white disabled:cursor-not-allowed"
										style={{
											background:
												"linear-gradient(94.86deg, #F84857 22.09%, #C7096F 85.17%), #5D3FFF",
										}}
									>
										Login
									</motion.button>
								</div>
								<div className="col-span-1 pl-8">
									<img className="w-full max-w-[13rem]" src={ButtonSideImage} alt="button-side" />
								</div>
							</div>
							<div className="text-white/70 text-sm">
								Don't you have an account?{" "}
								<Link to="/register" className="font-semibold text-white">
									Create an account
								</Link>
							</div>
						</form>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
