import { forwardRef, useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Check } from "react-bootstrap-icons";

const CheckBox = forwardRef(
	(
		{
			label,
			value,
			onChange,
			defaultChecked,
			colors = { checked: "#0066ff", unchecked: "#0000", uncheckedBorder: "#777777" },
			...rest
		},
		ref
	) => {
		const [checked, setChecked] = useState(!!defaultChecked);

		useEffect(() => {
			if (onChange) onChange(checked);
		}, [checked]);

		return (
			<motion.div
				ref={ref}
				className="inline-flex items-center cursor-pointer"
				onClick={() => {
					setChecked((curr) => !curr);
				}}
			>
				<motion.div
					className="inline-flex w-5 h-5 rounded-md border-2 border-gray-600 mr-2 justify-center items-center shrink-0"
					transition={{
						type: "tween",
						duration: 0.4,
					}}
					animate={{
						borderColor: checked
							? colors?.checked || "#0066ff"
							: colors?.uncheckedBorder || "#777777",
						backgroundColor: checked ? colors?.checked || "#0066ff" : colors?.unchecked || "#0000",
					}}
				>
					<Check size={"0.95rem"} color="white" />
				</motion.div>
				<div className="select-none">{label}</div>
			</motion.div>
		);
	}
);

export const CheckBoxLink = ({ link, label, ...rest }) => {
	return (
		<a href={link} onClick={(e) => e.stopPropagation()} {...rest}>
			{label}
		</a>
	);
};

export default CheckBox;
