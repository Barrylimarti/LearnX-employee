import { useState } from "react";

import { Building, Buildings, House } from "react-bootstrap-icons";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import AsyncSelect from "react-select/async";
import CreateableSelect from "react-select/creatable";

import Slider from "../../../components/utils/Slider";
import useApi from "../../../lib/useApi";

const reactSelectProps = {
	classNames: {
		container: () => `w-full`,
		control: () => {
			return `!min-h-0 !px-3 !py-3 border-solid !border-0 !border-b-1 !rounded-none !border-primary-default/40`;
		},
		indicatorSeparator: () => `hidden`,
		valueContainer: () => `!py-0`,
		multiValueLabel: () => `text-xl`,
	},
	styles: {
		indicatorsContainer: (baseStyles, state) => ({
			...baseStyles,
			div: {
				padding: "0!important",
			},
		}),
		multiValue: (styles) => ({ ...styles, backgroundColor: "transparent" }),
	},
};

const Tab1 = ({ register, control, continue: next }) => {
	const dataApi = useApi(false);
	const getLocations = async (key) => {
		return await dataApi.post("/data/locations", { key: key }).then((locations) => {
			return locations.map(({ name }) => ({ label: name, value: name }));
		});
	};

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-4xl font-semibold text-primary-default">Basic Details</h1>
				<p className="mt-2 text-sm font-medium text-neutral-1000/75">
					We use this information to find the best candidates for the job.
				</p>
			</div>
			<div className="p-8 border bg-background-0 rounded-xl">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
					<div className="col-span-1">
						<label className="inline-block text-primary-default mb-2 font-semibold">
							Job Category
						</label>
						<Controller
							name={"category"}
							control={control}
							rules={{ required: true }}
							render={({ field: { onChange, value: defValue } }) => (
								<ReactSelect
									{...reactSelectProps}
									placeholder="Select job category"
									defaultValue={defValue}
									options={[
										{ label: "Program Manager", value: "Program Manager" },
										{ label: "Software Developer", value: "Software Developer" },
										{ label: "Web Developer", value: "Web Developer" },
									]}
									onChange={({ value }) => onChange(value)}
								/>
							)}
						/>
					</div>
					<div className="col-span-1">
						<label className="inline-block text-primary-default mb-2 font-semibold">
							Job Title
						</label>
						<input
							type="text"
							className="text-black w-full px-5 py-4 border-0 border-b border-primary-default/40"
							placeholder="e.g. Senior Program Manager"
							{...register("title", { required: true })}
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
					<div className="col-span-1">
						<label className="inline-block text-primary-default mb-2 font-semibold">Job Type</label>
						<Controller
							name={"type"}
							control={control}
							rules={{ required: true }}
							render={({ field: { onChange, value } }) => (
								<ReactSelect
									{...reactSelectProps}
									placeholder="Select job type"
									options={[
										{ label: "Full-time Job", value: "full" },
										{ label: "Part-time Job", value: "part" },
										{ label: "Internship", value: "intern" },
									]}
									onChange={({ value }) => onChange(value)}
								/>
							)}
						/>
					</div>
					<div className="col-span-1">
						<label className="inline-block text-primary-default mb-2 font-semibold">Openings</label>
						<input
							type="number"
							className="text-black w-full px-5 py-4 border-0 border-b border-primary-default/40"
							defaultValue={1}
							{...register("openings", { required: true, min: 1 })}
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
					<div className="col-span-1">
						<label className="inline-block text-primary-default mb-2 font-semibold">
							Locations
						</label>
						<Controller
							name={"locations"}
							control={control}
							rules={{ required: true }}
							render={({ field: { onChange, value: defValue } }) => (
								<AsyncSelect
									{...reactSelectProps}
									placeholder="Select location"
									loadOptions={getLocations}
									defaultOptions
									cacheOptions
									isMulti
									defaultValue={defValue}
									onChange={(values) => onChange(values.map(({ value }) => value))}
								/>
							)}
						/>
					</div>
					<div className="col-span-1">
						<label className="inline-block text-primary-default mb-2 font-semibold">
							Minimum Points
						</label>
						<Controller
							name={"min_points"}
							control={control}
							rules={{ required: true }}
							defaultValue={0}
							render={({ field: { onChange, value } }) => (
								<div className="grid grid-cols-12 items-center">
									<div className="col-span-10">
										<Slider
											barSize={0.5}
											color={{
												thumb: "#2B3674",
												bar: "#2B367444",
												progress: "#2B3674",
											}}
											min={1}
											max={601}
											onInternalChange={onChange}
											defaultValue={value}
										/>
									</div>
									<input
										type="text"
										className="col-span-2 text-center text-black w-full px-5 py-4 border-0 border-b border-primary-default/40"
										value={value}
										onInput={(e) => {
											onChange(e.target.value);
										}}
									/>
								</div>
							)}
						/>
					</div>
				</div>
				<div className="mb-6">
					<h2 className="text-2xl font-semibold text-primary-default">Mode of Job</h2>
					<p className="mt-2 text-sm font-medium text-neutral-1000/75 mb-4">
						Let candidates know where they will be working from
					</p>
					<Controller
						name={"mode"}
						control={control}
						rules={{ required: true }}
						defaultValue="wfo"
						render={({ field: { onChange, value } }) => (
							<div className="flex gap-8">
								<div
									className={`flex gap-3 items-center p-5 min-w-[15rem] rounded-md shadow-lg ${
										value == "wfo" ? "border-2 border-green-500" : ""
									}`}
									onClick={() => onChange("wfo")}
								>
									<Buildings size={"2.5rem"} className="text-blue-500" />
									<p className="text-sm font-semibold">Work from Office</p>
								</div>
								<div
									className={`flex gap-3 items-center p-5 min-w-[15rem] rounded-md shadow-lg ${
										value == "wfh" ? "border-2 border-green-500" : ""
									}`}
									onClick={() => onChange("wfh")}
								>
									<House size={"2.5rem"} className="text-teal-500" />
									<p className="text-sm font-semibold">Work from Home</p>
								</div>
								<div
									className={`flex gap-3 items-center p-5 min-w-[15rem] rounded-md shadow-lg ${
										value == "hybrid" ? "border-2 border-green-500" : ""
									}`}
									onClick={() => onChange("hybrid")}
								>
									<Building size={"2.5rem"} className="text-purple-400" />
									<p className="text-sm font-semibold">Hybrid</p>
								</div>
							</div>
						)}
					/>
				</div>
				<div className="mb-6">
					<h2 className="text-2xl font-semibold text-primary-default">Job Description</h2>
					<p className="mt-2 text-sm font-medium text-neutral-1000/75 mb-4">
						Describe the responsibilities of job and other specific requirements here.
					</p>
					<textarea
						className="resize-none bg-background-0 text-black w-full min-h-[14rem] px-5 py-4 border border-primary-default/40 rounded-sm shadow-lg"
						placeholder="Job description / Additional requirements"
						{...register("description", { required: true })}
					/>
				</div>
			</div>
			<div>
				<button
					type="submit"
					className="px-7 py-4 rounded-xl text-md font-medium bg-gradient-primary text-white"
					onClick={() => next()}
				>
					Continue
				</button>
			</div>
		</div>
	);
};

const Tab2 = ({ register, control }) => {
	return (
		<div>
			<div className="tabs"></div>
			<div className="mb-6">
				<h1 className="text-4xl font-semibold text-primary-default">Candidate Requirements</h1>
				<p className="mt-2 text-sm font-medium text-neutral-1000/75">
					We use this information to find the best candidates for the job.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
				<div className="col-span-1">
					<label className="inline-block text-primary-default mb-2 font-semibold">
						Minimum Education
					</label>
					<Controller
						name={"requirements.degree"}
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, value } }) => (
							<ReactSelect
								{...reactSelectProps}
								placeholder="Select minimum degree"
								options={[
									{ label: "XII/12th Pass", value: "xii" },
									{ label: "Under Graduate", value: "ug" },
									{ label: "Post Graduate", value: "pg" },
									{ label: "Doctorate", value: "phd" },
								]}
								onChange={({ value }) => onChange(value)}
							/>
						)}
					/>
				</div>
				<div className="flex flex-col col-span-1">
					<label className="shrink-0 inline-block text-primary-default mb-2 font-semibold">
						Gender
					</label>
					<div className="grow flex items-center gap-8 px-4">
						<div className="flex items-center">
							<input
								className="h-6 w-6 mr-3"
								type="radio"
								value={"all"}
								{...register("requirements.gender")}
								id="radio-req-gender-all"
								checked
							/>
							<label htmlFor="radio-req-gender-male">All</label>
						</div>
						<div className="flex items-center">
							<input
								className="h-6 w-6 mr-3"
								type="radio"
								value={"male"}
								{...register("requirements.gender")}
								id="radio-req-gender-male"
							/>
							<label htmlFor="radio-req-gender-male">Male</label>
						</div>
						<div className="flex items-center">
							<input
								className="h-6 w-6 mr-3"
								type="radio"
								value={"female"}
								{...register("requirements.gender")}
								id="radio-req-gender-female"
							/>
							<label htmlFor="radio-req-gender-female">Female</label>
						</div>
						<div className="flex items-center">
							<input
								className="h-6 w-6 mr-3"
								type="radio"
								value={"other"}
								{...register("requirements.gender")}
								id="radio-req-gender-other"
							/>
							<label htmlFor="radio-req-gender-other">Other</label>
						</div>
					</div>
				</div>
			</div>
			<div className="mb-6">
				<h2 className="text-2xl font-semibold text-primary-default">Required Skills</h2>
				<p className="mt-2 text-sm font-medium text-neutral-1000/75 mb-4">
					We'll use these skills to further narrow down cadidates. Choose upto 10
				</p>
				<Controller
					name={"requirements.skills"}
					control={control}
					rules={{ required: true }}
					defaultValue={[]}
					render={({ field: { onChange, value } }) => (
						<CreateableSelect
							{...reactSelectProps}
							defaultValue={value}
							isMulti
							placeholder="Select or create new skills"
							options={["Figma", "Sketch", "Adobe XD", "Wireframe", "Prototype", "Canva"].map(
								(val) => ({ label: val, value: val })
							)}
							onChange={(values) => onChange(values.map(({ value }) => value))}
						/>
					)}
				/>
			</div>
			<div>
				<button
					type="submit"
					className="px-7 py-4 rounded-xl text-md font-medium bg-gradient-primary text-white"
				>
					Submit
				</button>
			</div>
		</div>
	);
};

export default function CreateJob({}) {
	const { register, control, trigger, handleSubmit, getValues } = useForm();
	const [tab, setTab] = useState(0);

	const navigate = useNavigate();
	const api = useApi(true);
	const onSubmit = async (data) => {
		try {
			const { id } = await api.post("/hr/job/create", data);
			navigate(`/job/${id}/candidates`);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<div className="flex gap-3 px-10 py-5">
				<NavLink
					end
					to="/job"
					className="px-5 py-2 text-xl font-semibold text-primary-default"
					style={({ isActive }) => (isActive ? { opacity: 1.0 } : { opacity: 0.6 })}
				>
					Posted Jobs
				</NavLink>
				<NavLink
					end
					to="/job/create"
					className="px-5 py-2 text-xl font-semibold text-primary-default"
					style={({ isActive }) => (isActive ? { opacity: 1.0 } : { opacity: 0.6 })}
				>
					Create New Job
				</NavLink>
			</div>
			<form className="px-10 pb-10" onSubmit={handleSubmit(onSubmit)}>
				{
					[
						<Tab1
							register={register}
							control={control}
							handleSubmit={handleSubmit}
							continue={async () => {
								if (
									await trigger(
										["category", "title", "type", "openings", "locations", "description"],
										{ shouldFocus: true }
									)
								)
									setTab(1);
								else console.log(getValues());
							}}
						/>,
						<Tab2 register={register} control={control} handleSubmit={handleSubmit} />,
					][tab]
				}
			</form>
		</div>
	);
}
