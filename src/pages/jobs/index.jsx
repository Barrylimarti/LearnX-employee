import { useEffect, useState } from "react";

import { format } from "date-fns";
import { InfoCircle, ListCheck } from "react-bootstrap-icons";
import { Link, NavLink } from "react-router-dom";

import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useApi from "../../lib/useApi";

const Job = ({ job: { title, category, _id, openings } }) => (
	<div className="flex p-8 rounded-2xl shadow-md border">
		<div className="grow">
			<h3 className="text-2xl font-semibold text-primary-default">{title}</h3>
			<h4 className="mt-2 text-lg font-medium text-primary-washedout/50">{category}</h4>
			<div className="mt-3">
				<h6 className="text-xs font-bold text-primary-faded">Invitations</h6>
				<div className="flex gap-2 mt-2">
					<span className="inline-block text-sm px-2 py-1 rounded-sm bg-info-washedout/50">
						Sent: 23
					</span>
					<span className="inline-block text-sm px-2 py-1 rounded-sm bg-info-washedout/50">
						Accepted: 9
					</span>
				</div>
			</div>
			<div className="mt-3">
				<h6 className="text-xs font-bold text-primary-faded">Status</h6>
				<div className="flex gap-2 mt-2">
					<span className="inline-block text-sm px-2 py-1 rounded-sm bg-info-washedout/50">
						Vacancies: {openings}
					</span>
					<span className="inline-block text-sm px-2 py-1 rounded-sm bg-info-washedout/50">
						Hired: 2
					</span>
				</div>
			</div>
		</div>
		<div className="shrink-0 flex flex-col justify-around">
			<Link
				to={`${_id}/candidates`}
				className="flex justify-center items-center px-4 py-3 rounded-xl bg-gradient-primary text-white"
			>
				<ListCheck className="inline-block mr-2" size={"1.6rem"} />
				List Candidates
			</Link>
			<Link
				to={`${_id}/info`}
				className="flex justify-center items-center px-4 py-3 rounded-xl bg-gradient-primary text-white"
			>
				<InfoCircle className="inline-block mr-2" size={"1.3rem"} />
				Show Details
			</Link>
		</div>
	</div>
);

export default function Jobs() {
	const [jobs, setJobs] = useState([]);

	const api = useApi(true);

	useEffect(() => {
		api.post("/hr/job/list", {}).then(setJobs).catch(console.error);
	}, []);
	return (
		<>
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
			<div className="flex flex-col px-10 pb-10 gap-6">
				<table className="border-separate border-spacing-y-3">
					<thead className="text-primary-default">
						<tr className="m-2 rounded-xl text-sm font-semibold shadow-md">
							<th className="text-start px-3 py-4 bg-background-200 rounded-tl-xl rounded-bl-xl">
								Job Role
							</th>
							<th className="text-start px-3 py-4 bg-background-200 hidden md:table-cell">
								Job Type
							</th>
							<th className="text-start px-3 py-4 bg-background-200 hidden md:table-cell">
								Openings
							</th>
							<th className="text-start px-3 py-4 bg-background-200 hidden xl:table-cell">
								Location
							</th>
							<th className="text-start px-3 py-4 bg-background-200 hidden lg:table-cell">
								Points Required
							</th>
							<th className="text-start px-3 py-4 bg-background-200 hidden md:table-cell">
								Invites Sent
							</th>
							<th className="text-start px-3 py-4 bg-background-200 hidden xl:table-cell">Date</th>
							<th className="px-3 py-4 bg-background-200 rounded-tr-xl rounded-br-xl text-end">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{jobs.map(
							({
								_id,
								title,
								category,
								type,
								openings,
								locations,
								min_points,
								max_points,
								mode,
								post_date,
								invites,
							}) => (
								<tr className="shadow-md rounded-xl" key={_id}>
									<td className="bg-background-0 px-3 py-2 rounded-tl-xl rounded-bl-xl">{title}</td>
									<td className="bg-background-0 px-3 py-2 hidden md:table-cell">
										{type == "full" ? "Full-Time" : type == "part" ? "Part-Time" : "Internship"}
									</td>
									<td className="bg-background-0 px-3 py-2 hidden md:table-cell">{openings}</td>
									<td className="bg-background-0 px-3 py-2 hidden xl:table-cell">
										{locations.join(", ")}
									</td>
									<td className="bg-background-0 px-3 py-2 hidden lg:table-cell">{min_points}</td>
									<td className="bg-background-0 px-3 py-2 hidden md:table-cell">
										{invites.length}
									</td>
									<td className="bg-background-0 px-3 py-2 hidden xl:table-cell">
										{format(new Date(post_date), "dd-MM-yy")}
									</td>
									<td className="bg-background-0 px-3 py-2 text-end rounded-tr-xl rounded-br-xl">
										<NavLink
											to={"/job/" + _id}
											className="mr-2 bg-gradient-primary text-white px-3 py-2 rounded-lg"
										>
											Details
										</NavLink>
										<button className="p-3">
											<FontAwesomeIcon icon={faEllipsisVertical} />
										</button>
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}
