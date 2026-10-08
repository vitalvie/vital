import type { ReactNode } from "react";
import { FlameIcon, HeartIcon, MoonIcon, PulseIcon } from "./icons";

// The health signals the watch brings together, as app-style tiles.
// Our own glyphs: they evoke the sources without using anyone's app icons.
const SOURCES: {
	label: string;
	icon: ReactNode;
	color: string;
	place: string;
}[] = [
	{
		label: "Sleep",
		icon: <MoonIcon size={26} />,
		color: "bg-indigo-500",
		place: "lg:top-[40%] lg:-left-9",
	},
	{
		label: "Heart rate",
		icon: <HeartIcon size={26} />,
		color: "bg-bad",
		place: "lg:top-5 lg:right-8",
	},
	{
		label: "HRV",
		icon: <PulseIcon size={26} />,
		color: "bg-teal-700",
		place: "lg:top-[46%] lg:-right-7",
	},
	{
		label: "Activity",
		icon: <FlameIcon size={26} />,
		color: "bg-band",
		place: "lg:right-4 lg:bottom-14",
	},
];

// A row under the watch on phones; floating around it from `lg`.
export function SignalSources() {
	return (
		<ul
			aria-label="Signals the watch brings together"
			className="pointer-events-none relative z-20 mt-5 flex justify-center gap-3 sm:gap-5 lg:static lg:mt-0"
		>
			{SOURCES.map((s, i) => (
				<li
					key={s.label}
					className={`animate-fade-up lg:absolute ${s.place}`}
					style={{ animationDelay: `${600 + i * 120}ms` }}
				>
					<div
						className="lg:animate-float flex w-16 flex-col items-center gap-1.5"
						style={{ animationDelay: `${i * -1500}ms` }}
					>
						<span
							className={`flex size-14 items-center justify-center rounded-2xl text-white shadow-lift ${s.color}`}
						>
							{s.icon}
						</span>
						<span className="text-xs leading-none font-medium whitespace-nowrap text-heading">
							{s.label}
						</span>
					</div>
				</li>
			))}
		</ul>
	);
}
