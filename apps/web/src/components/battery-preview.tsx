import { useCountUp } from "#/lib/count-up";
import { type Energy, energyLevel, energySummary } from "#/lib/energy";
import { EnergyGauge } from "./energy-gauge";
import { LevelPill } from "./level-pill";

// The Body Battery at a glance, floating next to the hero watch. Links to the full card.
export function BatteryPreview({
	energy,
	className = "",
}: {
	energy: Energy;
	className?: string;
}) {
	const score = Math.round(useCountUp(energy.score));
	return (
		<a
			href="#demo"
			className={`block rounded-3xl bg-white p-4 text-left shadow-lift transition duration-300 ease-smooth hover:-translate-y-1 ${className}`}
		>
			<span className="flex items-center justify-between gap-3">
				<span className="text-xs font-medium text-caption">Body Battery</span>
				<LevelPill level={energyLevel(energy.score)} />
			</span>
			<span className="mt-2 flex items-end gap-3">
				<span className="text-4xl leading-none font-bold tracking-tight text-heading tabular-nums">
					{score}
					<span className="text-lg font-medium text-caption">%</span>
				</span>
				<EnergyGauge score={energy.score} className="mb-1.5 flex-1" />
			</span>
			<span className="mt-2 block text-xs leading-4 text-caption text-pretty">
				{energySummary(energy.contributors)}
				<span className="sr-only"> See the numbers.</span>
			</span>
		</a>
	);
}
