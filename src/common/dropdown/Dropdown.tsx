import { useEffect, useRef, useState } from "react";

import { cn } from "@utils/cn";

export type SelectOption = {
	label: string;
	value: string;
};

interface SimpleSelectProps {
	options: SelectOption[];
	value: string | null;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

/**
 * SimpleSelect component - A reusable dropdown/select component with keyboard and mouse support.
 * @param {Object} props - Component props
 * @param {SelectOption[]} props.options - Array of options to display in the dropdown
 * @param {string | null} props.value - Current selected value
 * @param {(value: string) => void} props.onChange - Callback function when selection changes
 * @param {string} [props.placeholder="Select option"] - Placeholder text when nothing is selected
 * @param {boolean} [props.disabled=false] - Whether the select is disabled
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {React.ReactElement} The rendered SimpleSelect component
 */
const SimpleSelect: React.FC<SimpleSelectProps> = ({
	options,
	value,
	onChange,
	placeholder = "Select option",
	disabled = false,
	className
}) => {
	const [open, setOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	const selected = options.find((o) => o.value === value);

	/* close when click outside */
	useEffect(() => {
		/**
		 * Handles closing the dropdown when clicking outside the component.
		 * @param {MouseEvent} e - The mouse event triggered by clicking outside
		 */
		const handleClickOutside = (e: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={wrapperRef} className={cn("relative w-full", className)}>
			{/* Trigger */}
			<button
				type="button"
				disabled={disabled}
				onClick={() => setOpen((v) => !v)}
				className={cn(
					"w-full h-8 px-3 rounded-md",
					"flex items-center justify-between",
					"bg-background-100-2 text-white text-sm font-semibold",
					"border border-transparent",
					"focus:outline-none",
					disabled && "opacity-50 cursor-not-allowed"
				)}
			>
				<span className="truncate">{selected?.label ?? placeholder}</span>

				{/* SVG Arrow */}
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					className={cn(
						"transition-transform duration-200",
						open && "rotate-180"
					)}
				>
					<path
						d="M6 9l6 6 6-6"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			{/* Dropdown */}
			{open && (
				<ul className="absolute z-50 mt-1 w-full rounded-md overflow-hidden bg-[#2F322F] shadow-lg">
					{options.map((opt) => {
						const isSelected = opt.value === value;

						/**
						 * Handles the selection of an option in the dropdown.
						 */
						const handleSelect = () => {
							onChange(opt.value);
							setOpen(false);
						};

						/**
						 * Handles the key down event for the dropdown.
						 * @param {React.KeyboardEvent} e - The keyboard event
						 */
						const handleKeyDown = (e: React.KeyboardEvent) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								handleSelect();
							}
						};

						return (
							<li key={opt.value}>
								<button
									type="button"
									onClick={handleSelect}
									onKeyDown={handleKeyDown}
									className={cn(
										"w-full text-left px-3 py-2 cursor-pointer select-none text-white",
										"transition-colors",
										"focus:outline-none focus:ring-2 focus:ring-[#4F9669]",
										isSelected
											? "bg-[#4F9669]"
											: "hover:bg-[#494D49] active:bg-[#4F9669]"
									)}
								>
									{opt.label}
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default SimpleSelect;
