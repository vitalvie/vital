import {
	type DailyHealth,
	PRESETS,
	SIGNALS,
	type TodaySignals,
} from "#/data/mock-health";
import { CloseIcon } from "./icons";

type Props = {
	id: string;
	days: DailyHealth[];
	today: TodaySignals;
	onChange: (today: TodaySignals) => void;
	onClose: () => void;
};

export function DemoDataPanel({ id, days, today, onChange, onClose }: Props) {
	return (
		<section
			id={id}
			aria-label="Demo data"
			className="animate-fade-up rounded-3xl bg-white p-4 shadow-soft sm:p-6"
		>
			<div className="flex items-start justify-between gap-4">
				<div>
					<h2 className="text-sm font-medium text-heading">Demo data</h2>
					<p className="mt-1 text-sm leading-5 text-caption">
						Mocked, HealthKit-shaped numbers. Change last night to see how Vital
						reacts.
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close demo data"
					className="grid size-8 shrink-0 place-items-center rounded-full text-caption transition hover:bg-cream hover:text-heading focus-visible:outline-2 focus-visible:outline-indigo-500"
				>
					<CloseIcon size={16} />
				</button>
			</div>

			<div className="mt-4 flex flex-wrap gap-2">
				{PRESETS.map((p) => {
					const active = SIGNALS.every(
						({ key }) => p.today[key] === today[key],
					);
					return (
						<button
							key={p.label}
							type="button"
							aria-pressed={active}
							onClick={() => onChange(p.today)}
							className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-indigo-500 ${
								active
									? "bg-indigo-500 text-white"
									: "bg-indigo-50 text-heading hover:bg-indigo-100"
							}`}
						>
							{p.label}
						</button>
					);
				})}
			</div>

			<div className="mt-5 flex flex-col gap-5">
				{SIGNALS.map((s) => (
					<div key={s.key} className="flex flex-col gap-2">
						<div className="flex items-baseline justify-between gap-2">
							<label
								htmlFor={`${id}-${s.key}`}
								className="text-sm text-heading"
							>
								{s.label}
							</label>
							<span className="text-sm font-medium text-heading">
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
							className="w-full cursor-pointer accent-indigo-500"
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
					className={`flex-1 rounded-sm transition-[height] duration-300 ease-smooth ${
						i === days.length - 1 ? "bg-indigo-500" : "bg-indigo-100"
					}`}
					style={{
						height: `${25 + ((d[signal.key] - lo) / span) * 75}%`,
					}}
				/>
			))}
		</div>
	);
}
