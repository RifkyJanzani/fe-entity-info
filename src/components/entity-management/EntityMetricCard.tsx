import Card from "@common/card/Card";

/**
 * Card displaying an individual entity summary metric.
 *
 * @param {object} props - Component props.
 * @param {string} props.label - Metric title.
 * @param {string} props.value - Metric value.
 * @param {string} props.description - Explanatory subtitle.
 * @returns {React.ReactElement} The rendered metric card.
 */
const EntityMetricCard = ({
	label,
	value,
	description
}: {
	label: string;
	value: string;
	description: string;
}) => (
	<Card className="flex h-full flex-col gap-1 border border-white/5 bg-background-100-1/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
		<span className="text-xs uppercase tracking-[0.22em] text-white/45">
			{label}
		</span>
		<span className="text-2xl font-bold text-white">{value}</span>
		<span className="text-sm text-white/60">{description}</span>
	</Card>
);

export default EntityMetricCard;
