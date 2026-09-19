import { type HTMLAttributes } from "react";

import { cn } from "@utils/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
	toneClassName?: string;
	uppercase?: boolean;
};

/**
 * Reusable pill badge for status and map labels.
 *
 * @param {BadgeProps} props - Badge configuration and span attributes.
 * @returns {JSX.Element} The rendered badge element.
 */
const Badge = (props: BadgeProps) => {
	const { className, toneClassName, uppercase = true, ...spanProps } = props;

	return (
		<span
			className={cn(
				"inline-flex items-center justify-center rounded-full border px-2 py-1 text-[10px] font-semibold tracking-[0.18em]",
				uppercase && "uppercase",
				toneClassName,
				className
			)}
			{...spanProps}
		/>
	);
};

export default Badge;
