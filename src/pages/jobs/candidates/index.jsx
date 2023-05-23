import { useEffect, useRef, useState } from "react";

import { InfoCircleFill } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";

import CheckBox from "../../../components/utils/CheckBox";
import PrimaryModal from "../../../components/utils/PrimaryModal";
import useApi from "../../../lib/useApi";
import CandidateModal from "./components/candidate";

const Skill = ({ skill: { skill, mastery } }) => {
	return (
		<p className="inline-block px-4 py-2 rounded text-xs text-primary-default bg-blue-400/50">
			{skill}, <span className="ml-1 text-[0.5rem] text-primary-default/80">{mastery}/10</span>
		</p>
	);
};

const Candidate = ({
	candidate: { _id, name, field, points, location, about, skills, invited, invite },
	update,
	openModal,
}) => {
	const { id } = useParams();
	const api = useApi(true);

	return (
		<div className="p-6 border rounded-2xl shadow-md">
			<div className="flex mb-4">
				<div className="grow flex info">
					<div className="avatar h-28 w-28 p-3">
						<img
							className="h-full w-full rounded-full"
							src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?fit=crop&w=200&q=50"
							alt=""
						/>
					</div>
					<div className="grow">
						<h1 className="text-2xl font-semibold text-primary-default">{name}</h1>
						<p className="text-sm font-medium text-primary-default/50">{field}</p>
						<p className="text-sm text-primary-default/50">
							Points: {points} • Location: {location}
						</p>
					</div>
				</div>
				<div className="invite flex items-start">
					<button
						className="px-7 py-2 rounded-lg mr-4 text-md font-medium bg-info-washedout/40 text-primary-default"
						onClick={() => {
							openModal();
						}}
					>
						Details
					</button>
					{invited ? (
						<div className="inline-block">
							<button
								className="px-7 py-2 rounded-lg text-md font-medium bg-success-faded/40 text-green-900"
								disabled
							>
								Invited
							</button>
							<p className="text-center text-xs font-medium text-primary-washedout capitalize">
								{invite.status}
							</p>
						</div>
					) : (
						<button
							className="px-7 py-2 rounded-lg text-md font-medium bg-gradient-primary text-white"
							onClick={() => {
								api
									.post("/hr/job/invite", { job: id, candidate: _id })
									.then(update)
									.catch(console.error);
							}}
						>
							Send Invite
						</button>
					)}
				</div>
			</div>
			<div className="about flex items-center text-sm mb-4">
				<InfoCircleFill className="inline text-blue-300 mr-2" /> {about}
			</div>
			<div className="skills flex gap-3">
				{skills?.map((skill) => (
					<Skill key={skill._id} skill={skill} />
				))}
			</div>
		</div>
	);
};

const PointsFilter = ({ min, max, setFilters, ...rest }) => (
	<CheckBox
		label={
			<p className="flex items-center gap-2">
				<span className={`inline-block h-4 w-4 rounded ${rest.className}`}></span>
				<span>
					{min}-{max} Points
				</span>
			</p>
		}
		onChange={(val) => {
			setFilters((_filter) => {
				if (_filter.points?.length) {
					if (val) {
						const newPoints = [..._filter.points, { min, max }];
						const newFilter = { ..._filter, points: newPoints };
						return newFilter;
					} else {
						const newPoints = _filter.points.filter((val) => val.max != max && val.min != min);
						const newFilter = { ..._filter, points: newPoints.length ? newPoints : null };
						return newFilter;
					}
				}
				const newPoints = [{ min, max }];
				const newFilter = { ..._filter, points: newPoints };
				return newFilter;
			});
		}}
	/>
);

export default function Candidates() {
	const [candidates, setCandidates] = useState(null);
	const [counter, setCounter] = useState(0);
	const { id } = useParams();

	const [modalUser, setModalUser] = useState(null);

	const modalRef = useRef(null);

	const api = useApi(true);

	useEffect(() => {
		api.post("/hr/job/candidates", { id }).then(setCandidates).catch(console.error);
	}, []);

	useEffect(() => {
		if (modalUser) modalRef.current.open();
		else modalRef.current?.close();
		console.log(modalUser);
	}, [modalUser]);

	const [filters, setFilters] = useState({});
	useEffect(() => {
		api
			.post("/hr/job/candidates", { id, filters })
			.then((data) => setCandidates((_) => data))
			.catch(console.error);
	}, [filters, counter]);

	return (
		<div className="flex p-6 gap-6">
			<div className="filter rounded-2xl w-72 overflow-hidden bg-background-0 shadow-md">
				<h1 className="bg-primary-default px-6 py-4 text-2xl font-medium tracking-wider text-white">
					Filters
				</h1>
				<div className="p-4">
					<h5 className="mb-3 text-lg text-primary-default font-medium">Points</h5>
					<div className="flex flex-col gap-2">
						<PointsFilter min={0} max={150} className="bg-red-500" setFilters={setFilters} />
						<PointsFilter min={151} max={300} className="bg-orange-500" setFilters={setFilters} />
						<PointsFilter min={301} max={550} className="bg-teal-500" setFilters={setFilters} />
						<PointsFilter min={551} max={800} className="bg-purple-500" setFilters={setFilters} />
						<PointsFilter min={801} max={1000} className="bg-green-500" setFilters={setFilters} />
					</div>
				</div>
			</div>
			<div className="grow flex flex-col gap-10">
				{candidates
					? candidates.map((candidate) => (
							<Candidate
								key={candidate._id}
								candidate={candidate}
								update={() => setCounter((c) => c + 1)}
								openModal={() => setModalUser((_) => candidate._id)}
							/>
					  ))
					: null}
			</div>
			<PrimaryModal ref={modalRef} onClose={() => setModalUser((_) => null)}>
				{(closeModal) => <CandidateModal id={modalUser} />}
			</PrimaryModal>
		</div>
	);
}
