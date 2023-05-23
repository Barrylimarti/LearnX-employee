import { useState } from "react";

import { motion } from "framer-motion";
import { InfoCircleFill } from "react-bootstrap-icons";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { useRecoilState } from "recoil";

import Background from "../../../assets/backgrounds/register-bg.png";
import CheckBox, { CheckBoxLink } from "../../../components/utils/CheckBox";
import useApi from "../../../lib/useApi";
import { userSelector } from "../../../state/auth";

const reactSelectProps = {
	classNames: {
		container: () => `w-full`,
		control: ({ isFocused }) => {
			return `!min-h-0 !px-4 !py-3 border-solid !border !rounded-2xl !border-primary-default/40`;
		},
		indicatorSeparator: () => `hidden`,
		valueContainer: () => `!py-0`,
	},
	styles: {
		indicatorsContainer: (baseStyles, state) => ({
			...baseStyles,
			div: {
				padding: "0!important",
			},
		}),
	},
};

export default function Register() {
	const [user, setUser] = useRecoilState(userSelector);
	const { register, control, handleSubmit } = useForm();
	const [agree, setAgree] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const api = useApi();

	const onSubmit = async (data) => {
		const { error, accessToken, refreshToken, user } = await api.post("/hr/auth/register", data);
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

	const getCompanies = async (key) => {
		return await api.post("/company/list", { key: key }).then((companies) => {
			return companies.map(({ id, name, logo }) => ({ label: name, value: id, logo }));
		});
	};

	const formatOptionLabel = ({ label, logo }) => {
		return (
			<div className="flex items-center gap-3">
				<img className="w-8 h-8" src={"/" + logo} alt="logo" />
				<p>{label}</p>
			</div>
		);
	};

	return (
		<div className="relative min-h-screen bg-white">
			<div className="relative min-h-screen mx-auto overflow-x-hidden">
				<div className="absolute w-[110%] h-72 -translate-x-1/2 left-1/2 -translate-y-[33%]">
					<img src={Background} alt="bg" className="relative w-full h-full object-fill" />
				</div>
				<div className="relative h-36 w-1"></div>
				<div className="relative 2xl:container p-16 mx-auto">
					<h1 className="text-5xl font-bold text-primary-default text-center">
						Welcome to Heleum 👋
					</h1>
					<h6 className="text-md text-gray-400 mt-8 text-center">Kindly Enter Your Details!</h6>
					{error ? (
						<div className="mt-6">
							<p className="text-danger-default">{error}</p>
						</div>
					) : null}
					<form className="mt-6" action="" onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-6">
							<div className="flex justify-between">
								<label className="inline-block text-[#142B75] mb-2 text-sm font-semibold">
									Company
								</label>
								<Link
									to={"/create-company"}
									className="shrink-0 flex items-center gap-2 text-danger-faded text-sm"
								>
									<InfoCircleFill />
									Can't find your company? <strong className="underline">Create one here.</strong>
								</Link>
							</div>
							<Controller
								name={"company"}
								control={control}
								rules={{ required: true }}
								render={({ field: { onChange, value } }) => (
									<AsyncSelect
										{...reactSelectProps}
										formatOptionLabel={formatOptionLabel}
										placeholder="Select company"
										loadOptions={getCompanies}
										defaultOptions
										cacheOptions
										onChange={({ value }) => onChange(value)}
									/>
								)}
							/>
						</div>
						<div className="mb-6">
							<label className="inline-block text-[#142B75] mb-2 text-sm font-semibold">
								Full Name
							</label>
							<input
								type="text"
								className="bg-transparent text-primary-default w-full px-5 py-4 border border-primary-default/40 rounded-2xl"
								placeholder="e.g. Jay Logan"
								{...register("name", { required: true })}
							/>
						</div>
						<div className="mb-6">
							<label className="inline-block text-[#142B75] mb-2 text-sm font-semibold">
								Password
							</label>
							<input
								type="password"
								className="bg-transparent text-primary-default w-full px-5 py-4 border border-primary-default/40 rounded-2xl"
								placeholder="•••••••••••••••••"
								{...register("password", { required: true })}
							/>
						</div>
						<div className="mb-6">
							<label className="inline-block text-[#142B75] mb-2 text-sm font-semibold">
								Work Email
							</label>
							<input
								type="email"
								className="bg-transparent text-primary-default w-full px-5 py-4 border border-primary-default/40 rounded-2xl"
								placeholder="e.g. davon@company.com"
								{...register("email", { required: true })}
							/>
						</div>
						<div className="mb-10 text-center">
							<CheckBox
								defaultChecked={agree}
								label={
									<p className="text-primary-default">
										I agree to the{" "}
										<CheckBoxLink
											href="#"
											label="Terms and Conditions"
											className="text-primary-washedout underline"
										/>{" "}
										&{" "}
										<CheckBoxLink
											href="#"
											label="Privacy Policy"
											className="text-primary-washedout underline"
										/>
										.
									</p>
								}
								colors={{ checked: "#1751B0" }}
								onChange={(checked) => {
									setAgree(checked);
								}}
							/>
						</div>
						<div className="w-fit mx-auto">
							<motion.button
								className="w-full px-10 py-4 rounded-[3rem] font-semibold text-white disabled:text-gray-300 bg-gradient-primary disabled:cursor-not-allowed"
								animate={{
									opacity: agree ? 1 : 0.7,
								}}
								disabled={!agree}
							>
								Create Account
							</motion.button>
						</div>
					</form>
				</div>
			</div>
			<div className="h-4 w-full bg-[#568AE2]"></div>
			<div className="h-6 w-full bg-[#142B75]"></div>
		</div>
	);
}
