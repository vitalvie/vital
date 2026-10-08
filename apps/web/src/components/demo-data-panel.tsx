import {
	type DailyHealth,
	SIGNALS,
	type TodaySignals,
} from "#/data/mock-health";

type Props = {
	id: string;
	days: DailyHealth[];
	today: TodaySignals;
	onChange: (today: TodaySignals) => void;
};

// Sliders for today's three signals, each over its 14-day history.
export function DemoDataPanel({ id, days, today, onChange }: Props) {
	return (
		<section
			id={id}
			aria-label="Adjust today's numbers"
			className="animate-fade-up mt-3 rounded-3xl bg-white p-4 sm:p-5"
		>
			<p className="text-sm leading-5 text-caption">
				Drag a slider, then ask again. Indigo is today.
			</p>

			<div className="mt-3 flex flex-col gap-4">
				{SIGNALS.map((s) => (
					<div key={s.key} className="flex flex-col">
						<div className="flex items-baseline justify-between gap-2">
							<label
								htmlFor={`${id}-${s.key}`}
								className="text-sm text-heading"
							>
								{s.label}
							</label>
							<span className="text-sm font-medium text-heading tabular-nums">
								{today[s.key]}
								<span className="text-xs text-caption"> {s.unit}</span>
							</span>
						</div>
						<input
							id={`${id}-${s.key}`}
							type="range"
							min={s.min}
							max={s.max}
							step={s.step}
							value={today[s.key]}
							onChange={(e) =>
								onChange({ ...today, [s.key]: Number(e.target.value) })
							}
							className="h-11 w-full cursor-pointer accent-indigo-500"
						/>
						<History days={days} signal={s} />
					</div>
				))}
			</div>
		</section>
	);
}

function History({
	days,
	signal,
}: {
	days: DailyHealth[];
	signal: (typeof SIGNALS)[number];
}) {
	const values = days.map((d) => d[signal.key]);
	const lo = Math.min(...values);
	const span = Math.max(...values) - lo || 1;
	return (
		<div
			role="img"
			aria-label={`${signal.label}, last ${days.length} days`}
			className="flex h-8 items-end gap-1"
		>
			{days.map((d, i) => (
				<span
					key={d.date}
					title={`${d.date}: ${d[signal.key]} ${signal.unit}`}
					className={`h-full flex-1 origin-bottom rounded-sm transition-transform duration-300 ease-smooth ${
						i === days.length - 1 ? "bg-indigo-500" : "bg-indigo-100"
					}`}
					style={{
						transform: `scaleY(${0.25 + ((d[signal.key] - lo) / span) * 0.75})`,
					}}
				/>
			))}
		</div>
	);
}
