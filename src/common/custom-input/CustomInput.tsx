import React, { forwardRef } from "react";

import { cn } from "@utils/cn";

type CustomInputProps = {
	id?: string;
	name: string;
	value: string;

	placeholder?: string;
	disabled?: boolean;

	onChange: (value: string, name: string) => void;
	onBlur?: (name: string) => void;

	/** UI states */
	error?: boolean;
	helperText?: string;

	/** Input specific */
	maxLength?: number;
	showCounter?: boolean;

	className?: string;
};

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
	(
		{
			id,
			name,
			value,
			placeholder,
			disabled,
			onChange,
			onBlur,
			error,
			helperText,
			maxLength,
			showCounter,
			className
		},
		ref
	) => {
		return (
			<div className="relative w-full min-h-[15px]">
				<div
					className={cn(
						"relative h-8 px-3 rounded-md border transition",
						"bg-background-100-2",
						disabled && "opacity-50 cursor-not-allowed",
						error ? "border-error-1" : "border-transparent",
						"focus-within:border-info-light",
						className
					)}
				>
					<input
						ref={ref}
						id={id}
						name={name}
						value={value}
						disabled={disabled}
						maxLength={maxLength}
						placeholder={placeholder}
						onChange={(e) => onChange(e.target.value, name)}
						onBlur={() => onBlur?.(name)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === "Tab") {
								onBlur?.(name);
							}
						}}
						className={cn(
							"w-full h-full bg-transparent outline-none text-xs",
							"text-white",
							"placeholder:text-neutral-3"
						)}
					/>

					{showCounter && maxLength && (
						<span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/50">
							{value.length}/{maxLength}
						</span>
					)}
				</div>

				{helperText && (
					<p
						className={cn(
							"absolute left-0 top-[34px] text-[11px]",
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

export default CustomInput;
