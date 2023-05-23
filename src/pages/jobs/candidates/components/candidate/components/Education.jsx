import { format as formatDate } from "date-fns";
import { Buildings } from "react-bootstrap-icons";

const EducationItem = ({ institute, start, end, course, specialization, cgpa, percentage }) => {
	return (
		<div className="relative flex p-6">
			<div className="shrink-0 pr-3">
				<div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-400 text-neutral-0">
					<Buildings size={"2rem"} />
				</div>
			</div>
			<div className="flex flex-col">
				<p className="text-base font-medium text-primary-default">
					{course ? course : "XII/12th"}
					{specialization ? " - " + specialization : null}
				</p>
				<p className="text-sm font-medium text-primary-washedout">{institute}</p>
				<p className="text-sm font-light text-neutral-1000 mt-1">
					{start ? formatDate(new Date(start), "MMM, yyyy") + " - " : ""}
					{end
						? start
							? formatDate(new Date(end), "MMM, yyyy")
							: formatDate(new Date(end), "yyyy")
						: ""}
				</p>

				{typeof cgpa != "undefined" ? (
					<p className="text-sm text-primary-washedout/75 mt-1">CGPA: {cgpa}</p>
				) : null}
				{typeof percentage != "undefined" ? (
					<p className="text-sm text-primary-washedout/75 mt-1">Score: {percentage}</p>
				) : null}
			</div>
		</div>
	);
};

const Education = ({ education }) => {
	return (
		<div className="flex flex-col grow bg-neutral-0 rounded-3xl overflow-hidden">
			{education &&
			!!(education.bachelors.length +
			education.masters.length +
			education.doctorates.length +
			!!education.school.institute
				? 1
				: 0) ? (
				<div className="flex flex-col">
					{["doctorates", "masters", "bachelors"].map((key) => (
						<>
							{education[key].length ? (
								<div key={"education-" + key}>
									{education[key].map((val) => (
										<EducationItem key={val._id} {...val} />
									))}
								</div>
							) : null}
						</>
					))}
					{education.school.institute ? <EducationItem {...education.school} /> : null}
				</div>
			) : (
				<div className="grow flex items-center justify-center p-8">
					<h3 className="text-base font-medium text-primary-default/75">No education</h3>
				</div>
			)}
		</div>
	);
};

export default Education;
