import { forwardRef, useState } from "react";

import { XCircleFill } from "react-bootstrap-icons";

import Modal from "../base/Modal";

const PrimaryModal = forwardRef(({ title, children, onClose }, ref) => {
	const [open, setOpen] = useState(false);
	const closeModal = () => {
		setOpen(false);
		onClose();
	};

	ref.current = {
		open: () => setOpen((_) => true),
		toggle: () => setOpen((o) => !o),
		close: () => setOpen((_) => false),
	};

	return (
		<Modal isOpen={open} onRequestClose={closeModal}>
			<div className="flex flex-col p-8">
				<div className="shrink-0 flex justify-between items-center">
					<h1 className="text-4xl font-semibold">{title}</h1>
					<button onClick={closeModal}>
						<XCircleFill size={"2rem"} color="red" />
					</button>
				</div>
				<div className="grow min-h-0 overflow-y-auto">
					<div className="">{children ? children(closeModal) : null}</div>
				</div>
			</div>
		</Modal>
	);
});

export default PrimaryModal;
