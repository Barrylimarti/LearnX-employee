import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { CheckCircle, PencilSquare, PlusCircleFill, Trash3, XCircle } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";

import PopupMenu from "../../../components/utils/PopupMenu";
import Slider from "../../../components/utils/Slider";
import useApi from "../../../lib/useApi";

const SkillSlider = ({ id, skill, defaultValue = 1, onSave, onCancel, onDelete }) => {
	const [value, setValue] = useState(defaultValue);
	const [editable, setEditable] = useState(false);

	const api = useApi(true);

	const deleteSkill = async () => {
		try {
			const data = await api.post("/user/skills/delete", { id });
			if (data?.error) console.error(data.error);
			else if (onSave) onSave(data);
		} catch (error) {
			console.error(error);
		}
	};
	const save = async () => {
		try {
			const data = await api.post("/user/skills/edit", { id, mastery: value });
			if (data?.error) console.error(data.error);
			else if (onSave) onSave(data);
			setEditable((_) => false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-2">
			<div className="col-span-5 px-5 py-3 border-b-1 border-neutral-500/50">
				<p className="text-sm font-medium">{skill}</p>
				<p className="text-sm font-normal text-neutral-700">Field Name</p>
			</div>
			<div className="col-span-11 px-5 flex items-center gap-2 border-b-1 border-neutral-500/50">
				<div className={`relative grow ${!editable ? "pointer-events-none" : ""}`}>
					<Slider
						min={1}
						max={10}
						defaultValue={value}
						onChange={setValue}
						onInternalChange={setValue}
						color={{ thumb: "#132956", bar: "#CDD2DC" }}
					/>
				</div>
				<div className="w-8 flex justify-end text-sm font-semibold">
					{value < 10 ? 0 : ""}
					{value}/10
				</div>
			</div>
			<div className="col-span-4  flex justify-around items-center gap-2 border-b-1 border-neutral-500/50">
				{editable ? (
					<>
						<button type="button" onClick={() => save()}>
							<CheckCircle size={"1.2rem"} className="text-success-default" />
						</button>
						<button type="button" onClick={() => setEditable((_) => false)}>
							<XCircle size={"1.2rem"} className="text-danger-washedout" />
						</button>
					</>
				) : (
					<>
						<button type="button" onClick={() => setEditable((_) => true)}>
							<PencilSquare size={"1.2rem"} className="text-primary-washedout" />
						</button>
						<PopupMenu
							triggerContent={
								<button type="button">
									<Trash3 size={"1.2rem"} className="text-danger-washedout" />
								</button>
							}
							position="left center"
							offsetX={16}
						>
							{(closeMenu) => (
								<motion.div
									className="border rounded-xl bg-background-0 overflow-hidden shadow-2xl"
									style={{ originX: "100%", originY: "50%" }}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
								>
									<div className="p-4 border-b">Delete this skill?</div>
									<div className="grid grid-cols-2">
										<div
											className="col-span-1 px-4 py-2 border-r font-medium text-white bg-danger-default"
											onClick={() => {
												closeMenu();
												deleteSkill();
											}}
										>
											Delete
										</div>
										<div className="col-span-1 px-4 py-2" onClick={() => closeMenu()}>
											Cancel
										</div>
									</div>
								</motion.div>
							)}
						</PopupMenu>
					</>
				)}
			</div>
		</div>
	);
};

export const NewSkill = ({ defaultValue = 1, onSave, onCancel }) => {
	const [value, setValue] = useState(defaultValue);

	const { register, handleSubmit, setFocus } = useForm();

	const api = useApi(true);
	const onSubmit = async ({ skill }) => {
		// return console.log({ skill, mastery: value });
		try {
			const res = await api.post("/user/skills/add", { skill, mastery: value });
			if (onSave) onSave(res);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => setFocus("skill"), []);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-2"
		>
			<div className="col-span-5 px-4 py-2 border-b-1 border-neutral-500/50">
				<input
					className="w-full p-1 border focus:border-2 rounded-sm focus:outline-none border-primary-washedout/30 focus:border-heleum-500 text-sm font-medium"
					type="text"
					placeholder="Enter skill, e.g. HTML5"
					{...register("skill")}
				/>
			</div>
			<div className="col-span-11 px-5 flex items-center gap-2 border-b-1 border-neutral-500/50">
				<div className={`relative grow`}>
					<Slider
						min={1}
						max={10}
						defaultValue={value}
						onChange={setValue}
						color={{ thumb: "#132956", bar: "#CDD2DC" }}
					/>
				</div>
				<div className="w-8 flex justify-end text-sm font-semibold">
					{value < 10 ? 0 : ""}
					{value}/10
				</div>
			</div>
			<div className="col-span-4  flex justify-around items-center gap-2 border-b-1 border-neutral-500/50">
				<button type="submit">
					<CheckCircle size={"1.2rem"} className="text-success-default" />
				</button>

				<button type="button" onClick={() => onCancel()}>
					<XCircle size={"1.2rem"} className="text-danger-washedout" />
				</button>
			</div>
		</form>
	);
};

const Skills = ({ onPointsChange }) => {
	const [skills, setSkills] = useState([]);
	const [newSkill, setNewSkill] = useState(false);

	const api = useApi(true);
	useEffect(() => {
		api
			.post("/user/skills")
			.then((data) => setSkills((_) => data))
			.catch(console.error);
	}, []);

	return (
		<>
			<div className="flex justify-between">
				<div className="inline-flex items-center gap-3">
					<p className="text-2xl font-semibold text-heleum-500">Skills</p>
					<p className="text-sm">Add your skills to increase your profile strength.</p>
				</div>

				<motion.button
					type="button"
					animate={{ rotate: newSkill ? "-135deg" : "0deg" }}
					onTap={() => setNewSkill((o) => !o)}
				>
					<PlusCircleFill size={"2rem"} style={{ cursor: "pointer" }} />
				</motion.button>
			</div>
			<div className="bg-neutral-0 rounded-3xl overflow-hidden mt-4">
				<div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1">
					<div className="col-span-5 flex items-center justify-center py-5 text-sm font-medium bg-background-200">
						Skills
					</div>
					<div className="col-span-11 flex items-center justify-center py-5 text-sm font-medium bg-background-200">
						Rating
					</div>
					<div className="col-span-4 flex items-center justify-center py-5 text-sm font-medium bg-background-200">
						Actions
					</div>
				</div>
				<div className="flex flex-col h-[30rem]">
					{newSkill ? (
						<NewSkill
							onSave={(data) => {
								setSkills((_) => data);
								setNewSkill((_) => false);
								onPointsChange.current();
							}}
							onCancel={() => setNewSkill((_) => false)}
						/>
					) : null}
					{skills.length ? (
						skills
							.slice(0)
							.reverse()
							.map(({ _id, skill, mastery }) => (
								<div key={_id} className="mb-3">
									<SkillSlider
										id={_id}
										skill={skill}
										defaultValue={mastery}
										onSave={(data) => {
											setSkills((_) => data);
											onPointsChange.current();
										}}
										onDelete={(data) => {
											setSkills((_) => data);
											onPointsChange.current();
										}}
									/>
								</div>
							))
					) : (
						<div className="grow flex items-center justify-center">
							<p className="font-medium text-primary-washedout/30">
								Add skills by clicking on the '+' button
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Skills;
