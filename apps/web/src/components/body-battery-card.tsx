import type { Contributor, Energy } from "#/lib/energy";

export function BodyBatteryCard({ energy }: { energy: Energy }) {
	return (
		<section className="relative rounded-3xl bg-linear-to-br from-indigo-50 to-blue-50 p-6">
			<div className="absolute -top-4 right-6 rounded-2xl bg-peach px-4 py-2 shadow-soft">
				<p className="text-sm font-medium text-heading">
					{energy.today.sleepHours} h{" "}
					<span className="font-normal text-caption">slept</span>
				</p>
			</div>
			<p className="text-sm font-medium text-caption">Body Battery</p>
			<div className="mt-3 flex items-center gap-5">
				<Battery level={energy.score} />
				<p className="text-4xl font-bold text-heading">
					{energy.score}
					<span className="text-lg font-medium text-caption">%</span>
				</p>
			</div>
			<div className="mt-5 grid grid-cols-3 gap-3">
				{energy.contributors.map((c) => (
					<StatCard key={c.label} contributor={c} />
				))}
			</div>
		</section>
	);
}

function Battery({ level }: { level: number }) {
	const fill = level < 30 ? "bg-bad" : level < 60 ? "bg-warn" : "bg-good";
	return (
		<div
			role="img"
			aria-label={`Battery ${level}%`}
			className="flex items-center"
		>
			<div className="h-12 w-32 rounded-xl border-[3px] border-heading p-1">
				<div
					className={`h-full rounded-md ${fill} transition-[width] duration-700`}
					style={{ width: `${Math.max(level, 4)}%` }}
				/>
			</div>
			<div className="h-5 w-1.5 rounded-r-sm bg-heading" />
		</div>
	);
}

function StatCard({ contributor: c }: { contributor: Contributor }) {
	const sign = c.impact > 0 ? "+" : "";
	const pill = c.impact < 0 ? "bg-bad-bg text-bad" : "bg-good-bg text-good";
	return (
		<div className="flex flex-col gap-0.5 rounded-2xl bg-white p-3">
			<p className="text-xs text-caption">{c.label}</p>
			<p className="text-xl font-medium text-heading">
				{c.today}
				<span className="text-xs text-caption"> {c.unit}</span>
			</p>
			<div className="flex items-center justify-between gap-1">
				<p className="text-xs text-caption">usual {c.baseline}</p>
				<span
					className={`rounded-full px-1.5 py-0.5 text-[11px] font-medium ${pill}`}
				>
					{sign}
					{c.impact}
				</span>
			</div>
		</div>
	);
}
