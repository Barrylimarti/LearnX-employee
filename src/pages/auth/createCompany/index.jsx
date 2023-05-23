import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Background from "../../../assets/backgrounds/register-bg.png";
import CheckBox, { CheckBoxLink } from "../../../components/utils/CheckBox";
import useApi from "../../../lib/useApi";

export default function CreateCompany() {
	const { register, handleSubmit, watch, setValue } = useForm();
	const [agree, setAgree] = useState(false);
	const [error, setError] = useState(null);
	const imgRef = useRef(null);

	const navigate = useNavigate();

	const api = useApi();

	const onSubmit = async (data) => {
		const formData = new FormData();
		["name", "size", "website", "established", "file"].forEach((key) => {
			formData.append(key, key == "file" ? data[key][0] : data[key]);
		});
		const { error } = await api.post("/company/create", formData, "multipart/form-data");
		if (!error) {
			setError(null);
			navigate("/register");
		} else {
			setError(error);
		}
	};

	const file = watch("file");
	useEffect(() => {
		if (file && file[0]) {
			const reader = new FileReader();
			reader.onload = () => {
				imgRef.current.src = reader.result;
			};
			reader.readAsDataURL(file[0]);
		}
	}, [file]);

	return (
		<div className="relative min-h-screen bg-white">
			<div className="relative min-h-screen mx-auto overflow-x-hidden">
				<div className="absolute w-[110%] h-72 -translate-x-1/2 left-1/2 -translate-y-[33%]">
					<img src={Background} alt="bg" className="relative w-full h-full object-fill" />
				</div>
				<div className="relative h-36 w-1"></div>
				<div className="relative 2xl:container p-16 mx-auto">
					<h1 className="text-5xl font-bold text-primary-default text-center">
						Enter Company Details
					</h1>
					<h6 className="text-md text-gray-400 mt-8 text-center">
						Make sure everything you enter is correct.
					</h6>
					{error ? (
						<div className="mt-6">
							<p className="text-danger-default">{error}</p>
						</div>
					) : null}
					<form className="mt-6" action="" onSubmit={handleSubmit(onSubmit)}>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div className="mb-6">
								<label className="inline-block text-[#142B75] mb-2 text-sm font-semibold">
									Company Name
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
									Company Size
								</label>
								<input
									type="number"
									className="bg-transparent text-primary-default w-full px-5 py-4 border border-primary-default/40 rounded-2xl"
									placeholder="Enter approx. employee count"
									{...register("size", { required: true })}
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div className="mb-6">
								<label className="inline-block text-[#142B75] mb-2 text-sm font-semibold">
									Company Website
								</label>
								<input
									type="text"
									className="bg-transparent text-primary-default w-full px-5 py-4 border border-primary-default/40 rounded-2xl"
									placeholder="e.g. www.mycompany.com"
									{...register("website", { required: true })}
								/>
							</div>
							<div className="mb-6">
								<label className="inline-block text-[#142B75] mb-2 text-sm font-semibold">
									Year Established
								</label>
								<input
									type="number"
									className="bg-transparent text-primary-default w-full px-5 py-4 border border-primary-default/40 rounded-2xl"
									placeholder="Enter year of establishment"
									{...register("established", {
										required: true,
										min: 1000,
										max: new Date().getFullYear(),
									})}
								/>
							</div>
						</div>
						<div
							className="mb-10 w-fit mx-auto"
							onDragOver={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							onDrop={(e) => {
								e.stopPropagation();
								e.preventDefault();
								const files = e.dataTransfer.files;
								if (files.length) {
									setValue("file", files);
								}
							}}
						>
							<input
								id="avatar-input"
								type="file"
								className="absolute h-[1px] w-[1px] opacity-0"
								{...register("file")}
							/>
							<label className="inline-block text-[#142B75] mb-2 text-sm font-semibold">
								Company Logo
							</label>
							<div
								className="relative flex items-center justify-center h-64 w-64 border-dashed border-2 rounded-xl overflow-hidden mx-auto border-primary-default"
								onClick={() => document.getElementById("avatar-input").click()}
							>
								<img ref={imgRef} className="absolute w-full h-full bg-white" />
								<p className="text-center">Select or drop files here!</p>
							</div>
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
