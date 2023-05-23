import { useEffect, useState } from "react";

import { motion, MotionConfig } from "framer-motion";
import {
	BarChartLineFill,
	BellFill,
	BriefcaseFill,
	ChatDotsFill,
	EmojiExpressionlessFill,
	GearWideConnected,
	GridFill,
	Palette2,
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

import HeleumLogo from "../../assets/images/logo/heleum-logo-black.png";
import HeleumText from "../../assets/images/logo/heleum-text-black.png";

const MotionEnabledNavLink = motion(NavLink);

const SidebarLink = ({
	to = "",
	label = "",
	icon: Icon = EmojiExpressionlessFill,
	iconBackground,
	number = 0,
	numberColor = "",
}) => {
	const variants = {
		open: {
			width: "17rem",
		},
		closed: {
			width: "4rem",
		},
	};
	return (
		<MotionEnabledNavLink
			to={to}
			className={({
				isActive,
			}) => `flex items-center flex-nowrap px-4 py-3 rounded-xl text-primary-default text-base font-medium
			overflow-x-hidden ${isActive ? "bg-background-200 shadow-inner" : ""} hover:bg-background-200`}
			onClick={(e) => e.stopPropagation()}
			variants={variants}
		>
			<div
				className="relative shrink-0 flex items-center justify-center w-8 h-8 rounded-[0.5rem] text-white"
				style={{ backgroundColor: iconBackground }}
			>
				<Icon size={"1.3rem"} fill="#fff" />
				{number ? (
					<span className="inline-block absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 px-[4px] py-[2px] rounded-lg text-[0.69rem] leading-3 bg-danger-default text-white">
						{number < 100 ? number : "99+"}
					</span>
				) : null}
			</div>
			<p className="ml-4 whitespace-nowrap">{label}</p>
		</MotionEnabledNavLink>
	);
};

const SidebarLogo = ({}) => {
	const variants = {
		open: {
			width: "17rem",
		},
		closed: {
			width: "4rem",
		},
	};
	return (
		<motion.div variants={variants} className="flex items-end px-[0.875rem] py-2 overflow-x-hidden">
			<div className="flex items-center min-w-[17rem]">
				<div className="">
					<img className="shrink-0 w-9" src={HeleumLogo} alt="company_logo" />
				</div>
				<div className="overflow-hidden">
					<img className="w-[6.5rem] ml-4 object-contain" src={HeleumText} alt="comapny_text" />
				</div>
			</div>
		</motion.div>
	);
};

const SideBar = () => {
	const [open, setOpen] = useState(false);
	const [mouseIn, setMouseIn] = useState(false);

	const variants = {
		open: {
			width: "18rem",
		},
		closed: {
			width: "5rem",
		},
	};

	useEffect(() => {
		const mouseInState = mouseIn;
		const handle = setTimeout(() => setOpen(mouseInState), mouseInState ? 100 : 50);
		return () => clearTimeout(handle);
	}, [mouseIn]);

	return (
		<MotionConfig transition={{ type: "tween", duration: "0.3" }}>
			<div className="shrink-0 sticky top-0 w-20 h-screen z-50 bg-background-100">
				<motion.aside
					className="min-h-full bg-background-0/75 drop-shadow-xl backdrop-blur-xl"
					animate={open ? "open" : "closed"}
					variants={variants}
					transition={{
						type: "tween",
						staggerChildren: 0.005,
						staggerDirection: open ? 1 : -1,
						delay: open ? 0 : (9 + 1) * 0.02,
					}}
					// onClick={() => setOpen((open) => !open)}
					onTap={() => setOpen((o) => !o)}
					onMouseEnter={() => setMouseIn(true)}
					onMouseLeave={() => setMouseIn(false)}
				>
					<div className="px-2 pb-2 pt-4">
						<SidebarLogo />
					</div>
					<hr className="my-2" />
					<motion.nav className="flex flex-col p-2 gap-1">
						<SidebarLink to="/home" label="Home" icon={GridFill} iconBackground="#7A4CFC" />

						<SidebarLink to="/job" label="Jobs" icon={BriefcaseFill} iconBackground="#B5E369" />
						<SidebarLink
							to="/messaging"
							label="Messaging"
							icon={ChatDotsFill}
							iconBackground="#FE983A"
						/>
						<SidebarLink
							to="/analytics"
							label="Analytics"
							icon={Palette2}
							iconBackground="#82DD7A"
						/>
						<SidebarLink
							to="/invites"
							label="Job Invites"
							icon={BarChartLineFill}
							iconBackground="#DDBB7A"
						/>
					</motion.nav>
					<hr className="my-2" />
					<motion.nav className="flex flex-col p-2 gap-1">
						<SidebarLink
							to="/notifications"
							label="Notifications"
							icon={BellFill}
							iconBackground="#7A9CDD"
							number={100}
						/>
						<SidebarLink
							to="/preferences"
							label="Settings"
							icon={GearWideConnected}
							iconBackground="#000000"
						/>
					</motion.nav>
				</motion.aside>
			</div>
		</MotionConfig>
	);
};

export default SideBar;
