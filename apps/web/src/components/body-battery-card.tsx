import { useCountUp } from "#/lib/count-up";
import {
	type Contributor,
	contributorTone,
	type Energy,
	type EnergyLevel,
	energyLevel,
	energySummary,
	formatDelta,
	type Tone,
} from "#/lib/energy";

const LEVEL: Record<EnergyLevel, { fill: string; pill: string }> = {
	Low: { fill: "bg-bad", pill: "bg-bad-bg text-bad" },
	Moderate: { fill: "bg-warn", pill: "bg-peach text-warn-ink" },
	Good: { fill: "bg-good", pill: "bg-good-bg text-good" },
};

const TONE: Record<Tone, { pill: string; word: string }> = {
	good: { pill: "bg-good-bg text-good", word: "better than" },
	bad: { pill: "bg-bad-bg text-bad", word: "worse than" },
	neutral: { pill: "bg-indigo-50 text-caption", word: "close to" },
};

export function BodyBatteryCard({ energy }: { energy: Energy }) {
	const level = energyLevel(energy.score);
	const score = Math.round(useCountUp(energy.score));

	return (
		<section
			aria-labelledby="body-battery"
			className="rounded-3xl bg-linear-to-br from-indigo-50 to-blue-50 p-4 sm:p-6"
		>
			<div className="flex items-center justify-between gap-4">
				<h2 id="body-battery" className="text-sm font-medium text-caption">
					Body Battery
				</h2>
				<span
					className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-500 ${LEVEL[level].pill}`}
				>
					{level}
				</span>
			</div>
			<div className="mt-4 flex items-center gap-5">
				<Battery level={energy.score} fill={LEVEL[level].fill} />
				<div className="min-w-0">
					<p className="text-5xl leading-none font-bold text-heading tabular-nums">
						<span className="sr-only">{energy.score}%</span>
						<span aria-hidden="true">
							{score}
							<span className="text-xl font-medium text-caption">%</span>
						</span>
					</p>
					<p className="mt-2 text-sm leading-5 text-pretty">
						{energySummary(energy.contributors)}
					</p>
				</div>
			</div>
			<ul className="mt-5 grid gap-2 sm:grid-cols-3 sm:gap-3">
				{energy.contributors.map((c) => (
					<StatTile key={c.label} contributor={c} />
				))}
			</ul>
		</section>
	);
}

function Battery({ level, fill }: { level: number; fill: string }) {
	return (
		<div aria-hidden="true" className="flex shrink-0 items-center">
			<div className="h-12 w-24 rounded-xl border-[3px] border-heading p-1 min-[400px]:w-28 sm:w-32">
				<div className="h-full overflow-hidden rounded-md">
					<div
						className={`h-full rounded-md transition duration-700 ease-smooth ${fill}`}
						style={{ transform: `translateX(${Math.max(level, 6) - 100}%)` }}
					/>
				</div>
			</div>
			<div className="h-5 w-1.5 rounded-r-sm bg-heading" />
		</div>
	);
}

// A row on phones, a tile from `sm`: label, value, gap to usual, usual.
function StatTile({ contributor: c }: { contributor: Contributor }) {
	const tone = TONE[contributorTone(c)];
	const today = useCountUp(c.today).toFixed(c.digits);
	return (
		<li className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-2xl bg-white px-4 py-3 sm:grid-cols-1 sm:content-start sm:gap-y-1 sm:p-4">
			<p className="text-sm font-medium text-heading sm:text-xs sm:font-normal sm:text-caption">
				{c.label}
			</p>
			<div className="col-start-2 row-span-2 row-start-1 flex items-center gap-3 sm:col-start-auto sm:row-span-1 sm:row-start-auto sm:flex-col sm:items-start sm:gap-1.5">
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
					className={`min-w-16 rounded-full px-2 py-1 text-center text-xs leading-none font-medium whitespace-nowrap tabular-nums transition-colors duration-500 sm:min-w-0 ${tone.pill}`}
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
