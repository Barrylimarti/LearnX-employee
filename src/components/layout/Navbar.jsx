import { Bell, InfoCircle, Search, Sliders } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import userAtom from "../../state/user";

export default function Navbar() {
	const user = useRecoilValue(userAtom);
	const location = useLocation();
	const [searchParams] = useSearchParams();
	let title =
		location.state?.title ||
		(location.pathname
			?.split("/")
			.filter((x) => !!x)[0]
			?.split("-")
			.map((x) => (!!x ? x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase() : ""))
			.join(" ") ??
			"Home");

	const { register, handleSubmit } = useForm();

	const navigate = useNavigate();

	return (
		<div className="px-8 flex items-center justify-between gap-4 py-5 bg-background-100 z-40">
			<div>
				<h1 className="text-4xl font-bold text-primary-default">{title}</h1>
			</div>

			<div className="lg:grow flex items-center gap-6 h-[3.85rem] max-w-[54rem] pl-6 lg:pl-3 pr-3 py-2 rounded-4xl bg-background-0 drop-shadow-xl shadow-inner text-primary-washedout/75">
				<form
					onSubmit={handleSubmit((data) => {
						const path = title == "Search" ? location.pathname : "/search/users";
						if (title == "Search") searchParams.set("q", data.q);
						const params = title == "Search" ? searchParams.toString() : `q=${data.q}`;
						navigate({ pathname: path, search: `?${params}` });
					})}
					className="grow hidden lg:flex items-center gap-4 h-full px-6 rounded-3xl bg-background-100"
				>
					<Search size={"1rem"} />
					<input
						className="w-full h-full align-middle bg-transparent text-sm text-primary-default focus:outline-none"
						placeholder="Search Jobs, Users, HRs, Companies"
						type="text"
						{...register("q", { required: true })}
					/>
				</form>
				<Search className="lg:hidden" size={"1.5rem"} />
				<Bell size={"1.5rem"} />
				<Sliders size={"1.5rem"} />
				<InfoCircle size={"1.5rem"} />
				<img
					className="w-10 h-10 rounded-full object-cover"
					src={
						user.avatar
							? "/" + user.avatar
							: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=100&q=40"
					}
				/>
			</div>
		</div>
	);
}
