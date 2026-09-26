import {
	type Contributor,
	type Energy,
	type EnergyLevel,
	energyLevel,
	energySummary,
} from "#/lib/energy";

const FILL: Record<EnergyLevel, string> = {
	Low: "bg-bad",
	Moderate: "bg-warn",
	Good: "bg-good",
};

export function BodyBatteryCard({ energy }: { energy: Energy }) {
	return (
		<section className="rounded-3xl bg-linear-to-br from-indigo-50 to-blue-50 p-4 sm:p-6">
			<div className="flex items-center justify-between gap-4">
				<h2 className="text-sm font-medium text-caption">Body Battery</h2>
				<span className="rounded-full bg-peach px-3 py-1 text-xs font-medium text-heading">
					{energyLevel(energy.score)}
				</span>
			</div>
			<div className="mt-4 flex items-center gap-5">
				<Battery level={energy.score} />
				<div>
					<p className="text-4xl leading-none font-bold text-heading">
						{energy.score}
						<span className="text-lg font-medium text-caption">%</span>
					</p>
					<p className="mt-2 text-sm leading-5">
						{energySummary(energy.contributors)}
					</p>
				</div>
			</div>
			<div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
				{energy.contributors.map((c) => (
					<StatTile key={c.label} contributor={c} />
				))}
			</div>
		</section>
	);
}

function Battery({ level }: { level: number }) {
	const fill = FILL[energyLevel(level)];
	return (
		<div
			role="img"
			aria-label={`Battery ${level}%`}
			className="flex shrink-0 items-center"
		>
			<div className="h-12 w-28 rounded-xl border-[3px] border-heading p-1 sm:w-32">
				<div
					className={`h-full rounded-md ${fill} transition-[width] duration-700`}
					style={{ width: `${Math.max(level, 4)}%` }}
				/>
			</div>
			<div className="h-5 w-1.5 rounded-r-sm bg-heading" />
		</div>
	);
}

function StatTile({ contributor: c }: { contributor: Contributor }) {
	const sign = c.impact > 0 ? "+" : "";
	const pill = c.impact < 0 ? "bg-bad-bg text-bad" : "bg-good-bg text-good";
	return (
		<div className="flex min-w-0 flex-col gap-1 rounded-2xl bg-white p-2.5 sm:p-3">
			<div className="flex flex-wrap items-center justify-between gap-1">
				<p className="text-xs text-caption">{c.label}</p>
				<span
					className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none font-medium ${pill}`}
				>
					{sign}
					{c.impact}
				</span>
			</div>
			<p className="text-xl font-medium whitespace-nowrap text-heading">
				{c.today}
				<span className="text-xs text-caption"> {c.unit}</span>
			</p>
			<p className="text-xs text-caption">
				usual {c.baseline} {c.unit}
			</p>
		</div>
	);
}
