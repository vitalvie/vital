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

export function PresetList({
	today,
	onChange,
}: {
	today: TodaySignals;
	onChange: (today: TodaySignals) => void;
}) {
	return (
		<fieldset className="flex flex-wrap gap-2">
			<legend className="sr-only">Sample day</legend>
			{PRESETS.map((p) => {
				const active = SIGNALS.every(({ key }) => p.today[key] === today[key]);
				return (
					<button
						key={p.label}
						type="button"
						aria-pressed={active}
						onClick={() => onChange(p.today)}
						className={`min-h-9 rounded-full px-3.5 text-sm pointer-coarse:min-h-11 font-medium transition duration-200 ease-smooth active:scale-[0.97] ${
							active
								? "bg-indigo-500 text-white"
								: "bg-indigo-50 text-heading hover:bg-indigo-100"
						}`}
					>
						{p.label}
					</button>
				);
			})}
		</fieldset>
	);
}

export function DemoDataPanel({ id, days, today, onChange, onClose }: Props) {
	return (
		<section
			id={id}
			aria-label="Adjust today's numbers"
			className="animate-fade-up rounded-3xl bg-white p-4 shadow-soft sm:p-6"
		>
			<div className="flex items-start justify-between gap-4">
				<div>
					<h2 className="text-sm font-medium text-heading">
						Adjust today's numbers
					</h2>
					<p className="mt-1 text-sm leading-5 text-caption">
						Drag a slider, then ask again. Indigo is today.
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close number adjustments"
					className="-mt-2 -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-caption transition duration-200 ease-smooth hover:bg-cream hover:text-heading active:scale-95"
				>
					<CloseIcon size={16} />
				</button>
			</div>

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
