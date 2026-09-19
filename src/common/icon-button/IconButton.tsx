import React from "react";

import clsx from "clsx";

interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "success" | "ghost";
	size?: "sm" | "md" | "lg";
}

/**
 * A reusable IconButton component that supports variants, sizes, and disabled state.
 *
 * @param {IconButtonProps} props - Component props.
 * @param {React.ReactNode} props.children - The button's content (icon, text, etc.).
 * @param {string} [props.className] - Additional Tailwind or custom class names.
 * @param {"default" | "success" | "ghost"} [props.variant="default"] - Visual style variant of the button.
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Button size.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 *
 * @returns {JSX.Element} The rendered button element.
 */
const IconButton: React.FC<IconButtonProps> = ({
	children,
	className,
	variant = "default",
	size = "md",
	disabled,
	...props
}) => {
	const sizeClass = {
		sm: "w-7 h-7",
		md: "w-8 h-8",
		lg: "w-8 h-8"
	}[size];

	const variantClass = {
		default: "hover:bg-accent-3",
		ghost: "hover:bg-white/5",
		success: "bg-green-700/30 hover:bg-accent-3"
	}[variant];

	return (
		<button
			type="button"
			disabled={disabled}
			className={clsx(
				"w-8 h-8 flex items-center justify-center rounded transition flex-shrink-0 text-white bg-[#1D2420]",
				sizeClass,
				!disabled && variantClass,
				disabled && "opacity-50 cursor-not-allowed",
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
};

export default IconButton;
