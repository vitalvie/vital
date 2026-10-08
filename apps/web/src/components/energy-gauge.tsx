import { type EnergyLevel, energyLevel } from "#/lib/energy";

const FILL: Record<EnergyLevel, string> = {
	Low: "bg-bad",
	Moderate: "bg-warn",
	Good: "bg-good",
};

// Body Battery as a soft bar. The fill slides with a transform, so it never triggers layout.
export function EnergyGauge({
	score,
	className = "",
}: {
	score: number;
	className?: string;
}) {
	return (
		<div
			aria-hidden="true"
			className={`h-3 overflow-hidden rounded-full bg-indigo-50 ${className}`}
		>
			<div
				className={`h-full rounded-full transition duration-700 ease-smooth ${FILL[energyLevel(score)]}`}
				style={{ transform: `translateX(${Math.max(score, 4) - 100}%)` }}
			/>
		</div>
	);
}
