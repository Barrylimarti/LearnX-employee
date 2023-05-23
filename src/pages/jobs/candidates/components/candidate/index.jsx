import {
  useEffect,
  useState,
} from "react";

import {
  Behance,
  Dribbble,
  GeoAlt,
  Github,
  Linkedin,
  Medium,
} from "react-bootstrap-icons";

import AvatarBackground from "../../../../../assets/images/profile-bg.jpg";
import useApi from "../../../../../lib/useApi";
import Certificates from "./components/Certificates";
import Education from "./components/Education";
import Experience from "./components/Experience";

const PortfolioLink = ({
	icon: Icon = GlobeAmericas,
	label = "Other",
	link = "",
	color = "#000000",
}) => {
	return (
		<div className="relative shrink-0 grid grid-cols-2 w-80 h-24 rounded-2xl bg-background-0">
			<div className="col-span-1 flex items-center justify-between">
				<div
					className="ml-8 px-4 py-3 rounded-xl"
					style={{ boxShadow: "0px 5.30157px 7.95235px rgba(163, 174, 208, 0.25)" }}
				>
					<Icon size={"2.5rem"} color={color} />
				</div>
				<div
					className="w-2 h-14 rounded-tl-lg rounded-bl-lg"
					style={{
						background: "linear-gradient(90deg, #1BE7FF 0%, #C2F4FF 100%)",
					}}
				></div>
			</div>
			<div className="col-span-1 flex items-center p-4 border-l">
				<div className="max-w-full">
					<p className="text-sm text-primary-default font-medium">{label}</p>
					<a
						href={link}
						target="_blank"
						className="block text-xs text-blue-500 max-w-full overflow-hidden overflow-ellipsis"
					>
						{link}
					</a>
				</div>
			</div>
		</div>
	);
};

const supportedPortfolios = {
	behance: { icon: Behance, color: "#0056FF" },
	dribbble: { icon: Dribbble, color: "#0077B5" },
	github: { icon: Github, color: "#333" },
	linkedin: { icon: Linkedin, color: "#EC296A" },
	medium: { icon: Medium, color: "#000" },
};

const Portfolio = ({ links }) => {
	return (
		<div className="flex flex-nowrap gap-4 w-full overflow-x-auto">
			{links.map(({ _id, name, link }) => {
				let props = supportedPortfolios[name.toLowerCase()];
				if (!props) props = {};
				return <PortfolioLink key={_id} {...props} label={name} link={link} />;
			})}
		</div>
	);
};

const Skill = ({ skill, mastery }) => {
	return (
		<div className="flex items-center gap-2 h-12">
			<div
				className="shrink-0 flex justify-center items-center w-1/5 h-full px-2 rounded-md bg-background-200"
				title={skill}
			>
				<p>{skill}</p>
			</div>
			<div className="grow flex justify-center items-center w-full h-full rounded-md bg-background-200">
				<div className="w-5/6 bg-gray-400 h-1 rounded-sm">
					<div
						className="bg-primary-default h-1 rounded-sm "
						style={{ width: `${(mastery * 100) / 10}%` }}
					></div>
				</div>
			</div>
			<div className="shrink-0 flex justify-center items-center w-[10%] h-full px-2 rounded-md bg-background-200 text-sm font-medium">
				{mastery < 10 ? 0 : ""}
				{mastery}/10
			</div>
		</div>
	);
};

const Skills = ({ skills }) => {
	return (
		<div className="flex flex-col gap-2">
			{skills.map(({ skill, mastery, _id }) => (
				<Skill key={_id} skill={skill} mastery={mastery} />
			))}
		</div>
	);
};

export default function CandidateModal({ id }) {
	const [user, setUser] = useState(null);
	const api = useApi(false);

	useEffect(() => {
		api.post("/data/candidate", { id, keys: "" }).then(setUser).catch(console.error);
	}, []);

	return user ? (
		<div className="grow min-w-[1px] px-8 bg-background-0 pb-10">
			<div className="relative bg-white rounded-2xl px-10 pt-28 pb-6">
				<img
					className="absolute top-0 left-0 w-full h-40 object-cover object-center rounded-t-2xl"
					src={AvatarBackground}
					alt="avatar_background"
				/>
				<div className="relative flex gap-6">
					<div className="h-48 w-48 p-2 bg-white rounded-full">
						<img src={"/" + user.avatar} alt="" className="rounded-full" />
					</div>
					<div className="grow flex justify-between pt-14">
						<div className="grow flex flex-col gap-3">
							<h1 className="text-4xl font-semibold text-primary-default">{user.name}</h1>
							<h4 className="text-base font-medium text-primary-washedout">
								{user.field} • <GeoAlt className="inline-block" /> {user.location}
							</h4>
							<button className="w-fit px-6 py-1 mt-2 bg-gradient-primary rounded-lg text-white font-medium">
								Invite
							</button>
						</div>
						<div className="shrink-0">
							<div className="h-28 w-28 mt-3 shadow-md border rounded-lg justify-center items-center flex flex-col">
								<h3 className="text-lg font-medium text-primary-washedout">Points</h3>
								<p>{user.points}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-6 p-10 bg-background-0 rounded-2xl">
				<h1 className="mb-3 text-2xl font-semibold text-primary-default">About</h1>
				<p>{user.about}</p>
			</div>
			<div className="mt-6">
				<Portfolio links={user.links} />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
				<div className="col-span-1 p-10 bg-background-0 rounded-2xl">
					<h1 className="mb-3 text-2xl font-semibold text-primary-default">Skills</h1>
					<Skills skills={user.skills} />
				</div>
				<div className="col-span-1 p-10 bg-background-0 rounded-2xl">
					<h1 className="mb-3 text-2xl font-semibold text-primary-default">Experience</h1>
					<Experience experience={user.experience} />
				</div>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
				<div className="col-span-1 p-10 bg-background-0 rounded-2xl">
					<h1 className="mb-3 text-2xl font-semibold text-primary-default">Education</h1>
					<Education education={user.education} />
				</div>
				<div className="col-span-1 p-10 bg-background-0 rounded-2xl">
					<h1 className="mb-3 text-2xl font-semibold text-primary-default">Certificates</h1>
					<Certificates certificates={user.certificates} />
				</div>
			</div>
		</div>
	) : (
		<div className="grow flex justify-center items-center">
			<h1 className="text-4xl font-bold text-primary-default">Loading...</h1>
		</div>
	);
}
