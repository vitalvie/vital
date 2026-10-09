import type { ReactNode } from "react";
import { MicIcon, ShieldIcon } from "./icons";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

// Bento grid: one idea per tile, each with a small visual and a single sentence.
export function Benefits() {
	return (
		<section aria-labelledby="benefits-title" className="shell pb-section">
			<Reveal>
				<SectionHeading
					id="benefits-title"
					eyebrow="Why it feels different"
					title="Less dashboard. More answer."
				/>
			</Reveal>
			<ul className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-6 lg:gap-6">
				<Tile
					className="bg-indigo-50 lg:col-span-4"
					title="Voice first"
					text="Tap, ask, listen. There is no menu to learn and no chart to read."
				>
					<div className="flex items-center gap-5">
						<span className="relative block size-24 shrink-0">
							<span className="orb-core" />
							<span className="relative flex size-full items-center justify-center text-white">
								<MicIcon size={28} />
							</span>
						</span>
						<span className="flex h-12 items-center gap-1.5">
							{[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
								<span
									key={i}
									className="level-bar h-full w-1.5 rounded-full bg-indigo-300"
									style={{ animationDelay: `${i * 90}ms` }}
								/>
							))}
						</span>
					</div>
				</Tile>
				<Tile
					delay={100}
					className="bg-peach lg:col-span-2"
					title="Grounded in your numbers"
					text="Every answer sets today next to your own usual, never an average person's."
				>
					<div className="flex flex-col items-start gap-1.5 rounded-3xl bg-white px-5 py-4 shadow-soft">
						<span className="text-xs text-caption">Sleep</span>
						<span className="text-3xl leading-none font-bold text-heading tabular-nums">
							5.4<span className="text-base font-medium text-caption"> h</span>
						</span>
						<span className="text-xs text-caption tabular-nums">
							usual 7.5 h
						</span>
					</div>
				</Tile>
				<Tile
					delay={100}
					className="bg-teal-50 lg:col-span-2"
					title="Honest by design"
					text="Never a diagnosis. When something looks off, Vital points you to a professional."
				>
					<span className="flex size-20 items-center justify-center rounded-full bg-white text-teal-700 shadow-soft">
						<ShieldIcon size={36} />
					</span>
				</Tile>
				<Tile
					delay={200}
					className="bg-pink-50 lg:col-span-4"
					title="Short on purpose"
					text="Every answer is brief and spoken aloud. Then you get on with your day."
				>
					<p className="flex items-baseline gap-3 text-heading">
						<span className="text-display font-bold tabular-nums">2–3</span>
						<span className="text-subtitle">short sentences</span>
					</p>
				</Tile>
			</ul>
		</section>
	);
}

function Tile({
	title,
	text,
	className,
	delay = 0,
	children,
}: {
	title: string;
	text: string;
	className: string;
	delay?: number;
	children: ReactNode;
}) {
	return (
		<li className={`flex rounded-4xl ${className}`}>
			<Reveal delay={delay} className="flex w-full">
				<article className="flex w-full flex-col justify-between gap-8 p-6 sm:p-8">
					<div
						aria-hidden="true"
						className="flex min-h-32 items-center justify-center"
					>
						{children}
					</div>
					<div className="flex flex-col gap-2">
						<h3 className="text-subtitle text-heading">{title}</h3>
						<p className="max-w-md text-pretty">{text}</p>
					</div>
				</article>
			</Reveal>
		</li>
	);
}
