import { useEffect, useState } from "react";

import { NavLink, useLocation, useParams } from "react-router-dom";

import { faChevronLeft, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ResponsiveLine } from "@nivo/line";

import CheckBox from "../../../components/utils/CheckBox";
import useApi from "../../../lib/useApi";

const MyResponsiveLine = ({ data /* see data tab */ }) => (
	<ResponsiveLine
		data={data}
		colors={{ datum: "color" }}
		margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
		xScale={{ type: "point" }}
		yScale={{
			type: "linear",
			min: "auto",
			max: "auto",
			reverse: false,
		}}
		yFormat=" >-.2f"
		axisTop={null}
		axisRight={null}
		axisBottom={{
			orient: "bottom",
			tickSize: 5,
			tickPadding: 5,
			tickRotation: 0,
			legend: "Months",
			legendOffset: 36,
			legendPosition: "middle",
		}}
		axisLeft={{
			orient: "left",
			tickSize: 5,
			tickPadding: 5,
			tickRotation: 0,
			legend: "Count",
			legendOffset: -40,
			legendPosition: "middle",
		}}
		pointSize={10}
		pointColor={{ theme: "background" }}
		pointBorderWidth={2}
		pointBorderColor={{ from: "serieColor" }}
		pointLabelYOffset={-12}
		useMesh={true}
		legends={[
			{
				anchor: "bottom-right",
				direction: "column",
				justify: false,
				translateX: 100,
				translateY: 0,
				itemsSpacing: 0,
				itemDirection: "left-to-right",
				itemWidth: 80,
				itemHeight: 20,
				itemOpacity: 0.75,
				symbolSize: 12,
				symbolShape: "circle",
				symbolBorderColor: "rgba(0, 0, 0, .5)",
				effects: [
					{
						on: "hover",
						style: {
							itemBackground: "rgba(0, 0, 0, .03)",
							itemOpacity: 1,
						},
					},
				],
			},
		]}
	/>
);

export default function JobInfo() {
	const location = useLocation();
	const { id } = useParams();
	const [job, setJob] = useState(null);

	const api = useApi(true);
	useEffect(() => {
		console.log(location.pathname.split("/"));
		const id = location.pathname.split("/")[2].split(/[^\w]/)[0];
		api.post("/hr/job/info", { id }).then(setJob).catch(console.error);
	}, [location]);

	return job ? (
		<main className="grow min-w-[1px] px-8 bg-background-100">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center">
					<NavLink className="text-2xl px-3 py-2 font-semibold text-primary-default">
						<FontAwesomeIcon icon={faChevronLeft} />
					</NavLink>
					<h2 className="text-3xl py-2 font-semibold text-primary-default">{job.category}</h2>
				</div>
				<NavLink to="invite" className={"px-3 py-2 rounded-lg bg-gradient-primary text-white"}>
					<FontAwesomeIcon icon={faList} className="mr-1" /> List Candidates
				</NavLink>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="col-span-1 lg:col-span-7">
					<div className="p-6 h-[30rem] w-full rounded-2xl bg-background-0">
						<div className="flex justify-between">
							<h2 className="text-xl font-semibold text-primary-default">Invitation Analytics</h2>
							<div className="flex gap-3">
								<CheckBox label="Sent" defaultChecked={true} colors={{ checked: "#FFC659" }} />
								<CheckBox label="Accepted" defaultChecked={true} colors={{ checked: "#4FD2FB" }} />
								<CheckBox label="Deleted" />
							</div>
						</div>
						<MyResponsiveLine
							data={[
								{
									id: "you_invited",
									color: "#FFC659",
									data: [
										{
											x: "Jan",
											y: 100,
										},
										{
											x: "Feb",
											y: 120,
										},
										{
											x: "Mar",
											y: 70,
										},
										{
											x: "Apr",
											y: 56,
										},
										{
											x: "May",
											y: 113,
										},
										{
											x: "Jun",
											y: 121,
										},
									],
								},
								{
									id: "mean_invited",
									color: "#4FD2FB",
									data: [
										{
											x: "Jan",
											y: 96,
										},
										{
											x: "Feb",
											y: 102,
										},
										{
											x: "Mar",
											y: 90,
										},
										{
											x: "Apr",
											y: 89,
										},
										{
											x: "May",
											y: 103,
										},
										{
											x: "Jun",
											y: 91,
										},
									],
								},
							]}
						/>
					</div>
					<div className="mt-6 p-6 w-full rounded-2xl bg-background-0">
						<div className="flex justify-between">
							<h2 className="text-xl font-semibold text-primary-default">Description</h2>
							<div className="flex gap-3"></div>
						</div>
						<div className="p-3">
							<p>{job.description}</p>
						</div>
					</div>
				</div>
				<div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
					<div className="p-6 rounded-2xl bg-background-0">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-semibold text-primary-default">Invitation Response</h2>
							<div className="flex gap-3">
								<NavLink
									to="candidates"
									className={
										"px-3 py-1 rounded-lg border-primary-default border-2 text-primary-default hover:bg-primary-default hover:text-white transition-colors"
									}
								>
									Details
								</NavLink>
							</div>
						</div>
						<div className="p-2">
							<div className="grid grid-cols-2 border-b-2 border-solid border-primary-washedout/50">
								<div className="col-span-1 px-2 py-1 text-sm font-medium text-primary-washedout">
									Status
								</div>
								<div className="col-span-1 px-2 py-1 text-sm font-medium text-primary-washedout">
									Progress
								</div>
							</div>
							<div className="grid grid-cols-2 mt-2">
								<div className="col-span-1 px-2 py-1 text-gray-900">Sent</div>
								<div className="col-span-1 px-2 py-1 text-gray-900">{job.invites.length}</div>
							</div>
							<div className="grid grid-cols-2 mt-2">
								<div className="col-span-1 px-2 py-1 text-gray-900">Accepted</div>
								<div className="col-span-1 px-2 py-1 text-gray-900">
									{job.invites.filter(({ status }) => status == "accepted").length}
								</div>
							</div>
							<div className="grid grid-cols-2 mt-2">
								<div className="col-span-1 px-2 py-1 text-gray-900">Deleted</div>
								<div className="col-span-1 px-2 py-1 text-gray-900">
									{job.invites.filter(({ status }) => status == "deleted").length}
								</div>
							</div>
							<div className="grid grid-cols-2 mt-2">
								<div className="col-span-1 px-2 py-1 text-gray-900">Rejected</div>
								<div className="col-span-1 px-2 py-1 text-gray-900">
									{job.invites.filter(({ status }) => status == "rejected").length}
								</div>
							</div>
							<div className="grid grid-cols-2 mt-2">
								<div className="col-span-1 px-2 py-1 text-gray-900">Hired</div>
								<div className="col-span-1 px-2 py-1 text-gray-900">
									{job.invites.filter(({ status }) => status == "hired").length}
								</div>
							</div>
						</div>
					</div>
					<div className="p-6 rounded-2xl bg-background-0">
						<div className="flex justify-between">
							<h2 className="text-xl font-semibold text-primary-default">Metadata</h2>
							<div className="flex gap-3"></div>
						</div>
						<div className="p-2 rounded-2xl bg-background-0">
							<div className="grid grid-cols-12 mt-2">
								<div className="col-span-4 px-2 py-1 text-primary-faded">Title</div>
								<div className="col-span-8 px-2 py-1 text-gray-900">{job.title}</div>
							</div>
							<div className="grid grid-cols-12 mt-2">
								<div className="col-span-4 px-2 py-1 text-primary-faded">Points</div>
								<div className="col-span-8 px-2 py-1 text-gray-900">{job.min_points}</div>
							</div>
							<div className="grid grid-cols-12 mt-2">
								<div className="col-span-4 px-2 py-1 text-primary-faded">Job Type</div>
								<div className="col-span-8 px-2 py-1 text-gray-900">
									{job.type == "full"
										? "Full-Time"
										: job.type == "part"
										? "Part-Time"
										: "Internship"}
								</div>
							</div>
							<div className="grid grid-cols-12 mt-2">
								<div className="col-span-4 px-2 py-1 text-primary-faded">Deleted</div>
								<div className="col-span-8 px-2 py-1 text-gray-900">
									{job.invites.filter(({ status }) => status == "deleted").length}
								</div>
							</div>
							<div className="grid grid-cols-12 mt-2">
								<div className="col-span-4 px-2 py-1 text-primary-faded">Location</div>
								<div className="col-span-8 px-2 py-1 text-gray-900">{job.locations.join(", ")}</div>
							</div>
							<div className="grid grid-cols-12 mt-2">
								<div className="col-span-4 px-2 py-1 text-primary-faded">Skills Required</div>
								<div className="col-span-8 px-2 py-1 text-gray-900">
									{job.requirements.skills.join(", ")}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	) : (
		<div className="grow flex justify-center items-center">
			<h1 className="text-4xl font-bold text-primary-default">Loading...</h1>
		</div>
	);
}
