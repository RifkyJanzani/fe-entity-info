import React, { forwardRef, useState } from "react";

import { cn } from "@utils/cn";

type CustomTextAreaProps = {
	id?: string;
	name: string;
	value: string;

	placeholder?: string;
	disabled?: boolean;

	onChange: (value: string, name: string) => void;
	onBlur?: (name: string) => void;
	onFocus?: (name: string) => void;

	/** UI states */
	error?: boolean;
	helperText?: string;

	/** TextArea specific */
	maxLength?: number;
	showCounter?: boolean;
	showCounterOnFocus?: boolean;
	rows?: number;

	className?: string;
};

/**
 * A customizable textarea component with validation, counter, and focus states
 *
 * @param {Object} props - Component props
 * @param {string} [props.id] - ID attribute for the textarea
 * @param {string} props.name - Name attribute for the textarea
 * @param {string} props.value - Current value of the textarea
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.disabled] - Whether textarea is disabled
 * @param {Function} props.onChange - Callback when value changes
 * @param {Function} [props.onBlur] - Callback when textarea loses focus
 * @param {boolean} [props.error] - Whether textarea has error state
 * @param {string} [props.helperText] - Helper/error text below textarea
 * @param {number} [props.maxLength] - Maximum character length
 * @param {boolean} [props.showCounter] - Show character counter
 * @param {number} [props.rows=3] - Number of visible text rows
 * @param {string} [props.className] - Additional CSS classes
 *
 * @returns {JSX.Element} The CustomTextArea component
 */
const CustomTextArea = forwardRef<HTMLTextAreaElement, CustomTextAreaProps>(
	(
		{
			id,
			name,
			value,
			placeholder,
			disabled,
			onChange,
			onBlur,
			onFocus,
			error,
			helperText,
			maxLength,
			showCounter = false,
			showCounterOnFocus = false,
			rows = 3,
			className
		},
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false);

		/**
		 * Handles textarea focus event
		 */
		const handleFocus = () => {
			setIsFocused(true);
			if (onFocus) onFocus(name);
		};

		/**
		 * Handles textarea blur event
		 */
		const handleBlur = () => {
			setIsFocused(false);
			if (onBlur) onBlur(name);
		};

		const shouldShowCounter = showCounterOnFocus ? isFocused : showCounter;

		return (
			<div className="relative w-full">
				<div
					className={cn(
						"relative px-3 py-2 rounded-md border transition",
						"bg-background-100-2",
						disabled && "opacity-50 cursor-not-allowed",
						error ? "border-error-1" : "border-transparent",
						"focus-within:border-info-light",
						className
					)}
				>
					<textarea
						ref={ref}
						id={id}
						name={name}
						value={value}
						disabled={disabled}
						maxLength={maxLength}
						placeholder={placeholder}
						rows={rows}
						onChange={(e) => onChange(e.target.value, name)}
						onFocus={handleFocus}
						onBlur={handleBlur}
						className={cn(
							"w-full bg-transparent outline-none text-xs resize-none",
							"text-white",
							"placeholder:text-neutral-3"
						)}
					/>
				</div>

				{shouldShowCounter && maxLength && (
					<div className="absolute right-0 top-[146px] flex justify-end">
						<span className="text-[10px] text-white/50">
							{value.length}/{maxLength}
						</span>
					</div>
				)}

				{helperText && (
					<p
						className={cn(
							"mt-1 text-[11px]",
							error ? "text-error-1" : "text-white/50"
						)}
					>
						{helperText}
					</p>
				)}
			</div>
		);
	}
);

CustomTextArea.displayName = "CustomTextArea";

export default CustomTextArea;
