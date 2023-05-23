import { format } from "date-fns";
import { Briefcase } from "react-bootstrap-icons";

const ExperienceItem = ({ company, type, designation, description, start, end, current }) => {
	return (
		<div className="relative flex p-6">
			<div className="shrink-0 px-3">
				<div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-400 text-neutral-0">
					<Briefcase size={"2rem"} />
				</div>
			</div>
			<div>
				<p className="font-medium text-primary-default">{designation}</p>
				<p className="text-sm font-medium mt-1 text-primary-washedout">
					<span className="">{company}</span>
					{" • "}
					<span className="rounded-xl px-2 py-0 text-neutral-1000 bg-info-washedout/50">
						{type ? type : "Internship"}
					</span>
				</p>
				<p className="text-sm font-light text-neutral-1000 mt-1">
					{format(new Date(start), "MMM, yyyy")} -{" "}
					{current ? "Present" : format(new Date(end), "MMM, yyyy")}
				</p>
				<p className="text-sm text-primary-washedout/75 mt-3">{description}</p>
			</div>
		</div>
	);
};

const Experience = ({ experience }) => {
	return (
		<div className="flex flex-col grow bg-neutral-0 rounded-3xl overflow-hidden mt-4">
			<div className="flex flex-col">
				{experience && (experience?.jobs.length || experience?.internships.length) ? (
					<>
						{experience.jobs.length
							? experience.jobs.map((val) => (
									<ExperienceItem
										key={val._id}
										{...val}
										onRequestDelete={() => deleteXp("job", val._id)}
									/>
							  ))
							: null}
						{experience.internships.length
							? experience.internships.map((val) => (
									<ExperienceItem
										key={val._id}
										{...val}
										onRequestDelete={() => deleteXp("internship", val._id)}
									/>
							  ))
							: null}
					</>
				) : (
					<div className="grow flex items-center justify-center p-8">
						<h3 className="text-base font-medium text-primary-default/75">No experience</h3>
					</div>
				)}
			</div>
		</div>
	);
};

export default Experience;
