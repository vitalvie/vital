import { useCountUp } from "#/lib/count-up";
import {
	type Contributor,
	contributorTone,
	type Energy,
	energyLevel,
	energySummary,
	formatDelta,
	type Tone,
} from "#/lib/energy";
import { EnergyGauge } from "./energy-gauge";
import { LevelPill } from "./level-pill";

const TONE: Record<Tone, { pill: string; word: string }> = {
	good: { pill: "bg-good-bg text-good", word: "better than" },
	bad: { pill: "bg-bad-bg text-bad", word: "worse than" },
	neutral: { pill: "bg-indigo-50 text-caption", word: "close to" },
};

// Today's score, why it is what it is, and each signal next to its usual.
export function BodyBatteryCard({ energy }: { energy: Energy }) {
	const score = Math.round(useCountUp(energy.score));

	return (
		<section
			aria-labelledby="body-battery"
			className="@container rounded-4xl bg-white p-5 shadow-soft sm:p-7"
		>
			<div className="flex items-center justify-between gap-4">
				<h3 id="body-battery" className="text-sm font-medium text-caption">
					Body Battery
				</h3>
				<LevelPill level={energyLevel(energy.score)} />
			</div>
			<div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-2">
				<p className="text-6xl leading-none font-bold tracking-tight text-heading tabular-nums">
					<span className="sr-only">{energy.score}%</span>
					<span aria-hidden="true">
						{score}
						<span className="text-2xl font-medium text-caption">%</span>
					</span>
				</p>
				<p className="max-w-xs pb-1 text-sm leading-5 text-pretty">
					{energySummary(energy.contributors)}
				</p>
			</div>
			<EnergyGauge score={energy.score} className="mt-4" />
			<ul className="mt-5 grid gap-2 @lg:grid-cols-3 @lg:gap-3">
				{energy.contributors.map((c) => (
					<StatTile key={c.label} contributor={c} />
				))}
			</ul>
		</section>
	);
}

// A row in a narrow card, a tile in a wide one: label, value, gap to usual, usual.
function StatTile({ contributor: c }: { contributor: Contributor }) {
	const tone = TONE[contributorTone(c)];
	const today = useCountUp(c.today).toFixed(c.digits);
	return (
		<li className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-2xl bg-cream px-4 py-3 @lg:grid-cols-1 @lg:content-start @lg:gap-y-1 @lg:p-4">
			<p className="text-sm font-medium text-heading @lg:text-xs @lg:font-normal @lg:text-caption">
				{c.label}
			</p>
			<div className="col-start-2 row-span-2 row-start-1 flex items-center gap-3 @lg:col-start-auto @lg:row-span-1 @lg:row-start-auto @lg:flex-col @lg:items-start @lg:gap-1.5">
				<p className="text-xl leading-7 font-medium whitespace-nowrap text-heading tabular-nums">
					<span className="sr-only">
						{c.today} {c.unit}, {tone.word} your usual
					</span>
					<span aria-hidden="true">
						{today}
						<span className="text-xs text-caption"> {c.unit}</span>
					</span>
				</p>
				<span
					aria-hidden="true"
					className={`min-w-16 rounded-full px-2 py-1 text-center text-xs leading-none font-medium whitespace-nowrap tabular-nums transition-colors duration-500 @lg:min-w-0 ${tone.pill}`}
				>
					{formatDelta(c)}
				</span>
			</div>
			<p className="text-xs leading-5 text-caption">
				usual {c.baseline} {c.unit}
			</p>
		</li>
	);
}
