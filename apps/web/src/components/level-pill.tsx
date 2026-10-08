import type { EnergyLevel } from "#/lib/energy";

const PILL: Record<EnergyLevel, string> = {
	Low: "bg-bad-bg text-bad",
	Moderate: "bg-peach text-warn-ink",
	Good: "bg-good-bg text-good",
};

export function LevelPill({ level }: { level: EnergyLevel }) {
	return (
		<span
			className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-500 ${PILL[level]}`}
		>
			{level}
		</span>
	);
}
