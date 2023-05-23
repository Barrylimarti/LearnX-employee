import { motion, MotionConfig } from "framer-motion";
import ReactModal from "react-modal";

const ModalOverlay = ({ isOpen, onClick, children: contentElement }) => (
	<motion.div
		className="fixed flex items-center justify-center h-screen w-screen top-0 left-0 bg-neutral-1000/50"
		initial={{
			opacity: isOpen ? 0 : 1,
		}}
		animate={{
			opacity: isOpen ? 1 : 0,
		}}
		onClick={onClick}
	>
		{contentElement}
	</motion.div>
);

const ModalContent = ({ isOpen, children }) => (
	<motion.div
		className="w-full h-fit max-w-7xl max-h-[45rem] rounded-2xl overflow-auto bg-background-0"
		transition={{ type: "spring" }}
		initial={isOpen ? { opacity: 0, y: "-100%" } : { opacity: 1, y: "0%" }}
		animate={isOpen ? { opacity: 1, y: "0%" } : { opacity: 0, y: "100%" }}
		onClick={(e) => e.stopPropagation()}
	>
		{children}
	</motion.div>
);

export default function Modal({ isOpen = false, onRequestClose, closeTimeout = 1000, children }) {
	return (
		<MotionConfig transition={{ type: "tween" }}>
			<ReactModal
				isOpen={isOpen}
				onRequestClose={onRequestClose}
				closeTimeoutMS={closeTimeout}
				overlayElement={(_, contentElement) => (
					<ModalOverlay isOpen={isOpen} onClick={onRequestClose}>
						{contentElement}
					</ModalOverlay>
				)}
				contentElement={(_, children) => <ModalContent isOpen={isOpen}>{children}</ModalContent>}
			>
				{children}
			</ReactModal>
		</MotionConfig>
	);
}
