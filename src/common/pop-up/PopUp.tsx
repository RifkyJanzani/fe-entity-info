import React, { useEffect, useRef, useState } from "react";

import IconButton from "@common/icon-button/IconButton";
import CloseIcon from "@common/icon/CloseIcon";

import { cn } from "@utils/cn";

interface PopUpProps {
	title: string;
	width?: number;
	height?: number;
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
	containerRef?: React.RefObject<HTMLDivElement>;
}

/**
 * A draggable and moveable popup component that displays content in a centered modal
 *
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The title displayed in the popup header
 * @param {number} [props.width=462] - Width of the popup in pixels
 * @param {number} [props.height=339] - Height of the popup in pixels
 * @param {boolean} props.isOpen - Controls visibility of the popup
 * @param {Function} props.onClose - Callback function when close is triggered
 * @param {React.ReactNode} props.children - Content to display inside the popup
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.RefObject<HTMLDivElement>} [props.containerRef] - Reference to container for boundary constraints
 *
 * @returns {JSX.Element | null} The popup component or null if not open
 */
const PopUp: React.FC<PopUpProps> = ({
	title,
	width = 462,
	height = 339,
	isOpen,
	onClose,
	children,
	className,
	containerRef
}) => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const popupRef = useRef<HTMLDivElement>(null);

	// Reset position when popup opens
	useEffect(() => {
		if (isOpen) {
			setPosition({ x: 0, y: 0 });
		}
	}, [isOpen]);

	const popupWidth = Math.min(
		width,
		typeof window !== "undefined" ? window.innerWidth - 16 : width
	);
	const popupHeight = Math.min(
		height,
		typeof window !== "undefined" ? window.innerHeight - 95 : height
	);

	/**
	 * Handles mousedown event on the popup.
	 * Starts dragging the popup if the event target is inside the header.
	 * Sets isDragging state to true and records the drag start position.
	 * @param {React.MouseEvent<HTMLDivElement>} e - The mouse event
	 */
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		// Only start drag if clicking on the header
		if ((e.target as HTMLElement).closest("[data-drag-handle]")) {
			setIsDragging(true);
			setDragStart({
				x: e.clientX - position.x,
				y: e.clientY - position.y
			});
		}
	};

	useEffect(() => {
		/**
		 * Handles mousemove event on the popup.
		 * Updates the position of the popup if isDragging is true.
		 * Constrains the new position to be within the boundaries of the container if containerRef is provided.
		 * @param {MouseEvent} e - The mouse event containing client coordinates
		 */
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging) return;

			let newX = e.clientX - dragStart.x;
			let newY = e.clientY - dragStart.y;

			// Constraint boundaries if containerRef is provided
			if (containerRef?.current && popupRef.current) {
				const container = containerRef.current.getBoundingClientRect();

				// Calculate max boundaries
				const maxX = (container.width - popupWidth) / 2;
				const maxY = (container.height - popupHeight) / 2;
				const minX = -maxX;
				const minY = -maxY;

				// Apply boundaries
				newX = Math.max(minX, Math.min(maxX, newX));
				newY = Math.max(minY, Math.min(maxY, newY));
			}

			setPosition({ x: newX, y: newY });
		};

		/**
		 * Handles mouseup event on the document.
		 * Resets the isDragging state to false.
		 */
		const handleMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, dragStart, containerRef, popupWidth, popupHeight]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			style={{ pointerEvents: "none" }}
		>
			<div
				ref={popupRef}
				aria-modal="true"
				aria-labelledby="popup-title"
				tabIndex={-1}
				className={cn(
					"relative flex flex-col rounded-lg bg-background-100-3 shadow-2xl",
					isDragging && "cursor-grabbing",
					className
				)}
				style={{
					width: `${popupWidth}px`,
					height: `${popupHeight}px`,
					maxWidth: "calc(100vw - 1rem)",
					maxHeight: "calc(100vh - 1rem)",
					transform: `translate(${position.x}px, ${position.y}px)`,
					pointerEvents: "auto",
					transition: isDragging ? "none" : "transform 0.2s ease-out"
				}}
			>
				<div
					data-drag-handle
					onMouseDown={handleMouseDown}
					className={cn(
						"w-full flex items-center justify-between px-3 py-4 cursor-grab active:cursor-grabbing select-none",
						"bg-transparent border-none outline-none",
						isDragging && "cursor-grabbing"
					)}
				>
					<h2 id="popup-title" className="text-white text-xl font-semibold">
						{title}
					</h2>
					<IconButton
						onClick={onClose}
						variant="ghost"
						size="sm"
						className="text-white hover:text-neutral-2 -ml-2"
					>
						<CloseIcon className="w-3 h-3" />
					</IconButton>
				</div>
				<div className="flex-1 min-h-0 overflow-y-auto px-4 py-1">
					{children}
				</div>
			</div>
		</div>
	);
};

export default PopUp;
