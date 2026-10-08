import { useState } from "react";
import {
	type DailyHealth,
	PRESETS,
	SIGNALS,
	type TodaySignals,
} from "#/data/mock-health";
import { DemoDataPanel } from "./demo-data-panel";
import { ChevronDownIcon, SlidersIcon } from "./icons";

type Props = {
	days: DailyHealth[];
	today: TodaySignals;
	onChange: (today: TodaySignals) => void;
};

// The explicit demo control: pick a sample day, or open the sliders. Collapsible.
export function ScenarioControl({ days, today, onChange }: Props) {
	const [open, setOpen] = useState(true);
	const [editing, setEditing] = useState(false);
	const active = PRESETS.findIndex((p) =>
		SIGNALS.every(({ key }) => p.today[key] === today[key]),
	);

	return (
		<section
			aria-labelledby="scenario-title"
			className="rounded-4xl bg-white/60 p-4 sm:p-5"
		>
			<div className="flex items-center justify-between gap-3">
				<p className="text-sm leading-5 text-caption">
					<span
						id="scenario-title"
						className="mr-2 rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-medium text-white"
					>
						Demo data
					</span>
					<span className="max-sm:sr-only">
						Pick a sample day, then ask again.
					</span>
				</p>
				<button
					type="button"
					aria-expanded={open}
					aria-controls="scenario-body"
					onClick={() => setOpen((v) => !v)}
					className="chip -my-1 hover:bg-white"
				>
					{open ? "Hide" : "Show"}
					<span
						className={`transition-transform duration-300 ease-smooth ${open ? "rotate-180" : ""}`}
					>
						<ChevronDownIcon />
					</span>
				</button>
			</div>

			<div id="scenario-body" hidden={!open} className="mt-3">
				<div className="flex flex-wrap items-center gap-2">
					<fieldset className="relative grid min-w-0 flex-1 basis-full grid-cols-3 rounded-full bg-indigo-100/70 p-1 sm:basis-0">
						<legend className="sr-only">Sample day</legend>
						<span
							aria-hidden="true"
							className={`absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-white shadow-soft transition duration-300 ease-smooth ${active < 0 ? "opacity-0" : ""}`}
							style={{ transform: `translateX(${Math.max(active, 0) * 100}%)` }}
						/>
						{PRESETS.map((p, i) => (
							<button
								key={p.label}
								type="button"
								aria-pressed={i === active}
								onClick={() => onChange(p.today)}
								className={`relative min-h-9 rounded-full px-1 text-xs font-medium transition-colors duration-300 min-[400px]:text-sm pointer-coarse:min-h-11 ${
									i === active
										? "text-heading"
										: "text-paragraph hover:text-heading"
								}`}
							>
								{p.label}
							</button>
						))}
					</fieldset>
					<button
						type="button"
						aria-expanded={editing}
						aria-controls="demo-data"
						onClick={() => setEditing((v) => !v)}
						className={`chip ${
							editing
								? "bg-indigo-500 text-white"
								: "bg-white shadow-soft hover:bg-indigo-50"
						}`}
					>
						<SlidersIcon />
						Adjust numbers
					</button>
				</div>
				{editing && (
					<DemoDataPanel
						id="demo-data"
						days={days}
						today={today}
						onChange={onChange}
					/>
				)}
			</div>
		</section>
	);
}
