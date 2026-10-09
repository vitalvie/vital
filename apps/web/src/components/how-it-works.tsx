import type { ReactNode } from "react";
import { mockHealth, PRESETS, withToday } from "#/data/mock-health";
import { computeEnergy, contributorTone, formatDelta } from "#/lib/energy";
import { SpeakerIcon } from "./icons";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

// The "Short night" sample day, so the story uses the same numbers as the demo.
const SHORT_NIGHT = computeEnergy(withToday(mockHealth, PRESETS[0].today));

const DELTA = {
	good: "bg-good-bg text-good",
	bad: "bg-bad-bg text-bad",
	neutral: "bg-indigo-50 text-caption",
};

export function HowItWorks() {
	return (
		<section
			id="how"
			aria-labelledby="how-title"
			className="shell scroll-mt-24 py-section"
		>
			<Reveal>
				<SectionHeading
					id="how-title"
					eyebrow="How it works"
					title="Ask. Understand. Answer."
					lead="Three steps, a few seconds. No dashboard to decode."
				/>
			</Reveal>
			<ol className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-6">
				<Step
					n={1}
					color="bg-peach"
					title="Ask out loud"
					text="Tap the orb and talk the way you would to a friend. Tap again to send."
				>
					<AskVisual />
				</Step>
				<Step
					n={2}
					color="bg-pink-50"
					title="Vital reads today against your usual"
					text="It compares today with your usual, from the sample day on screen."
				>
					<UnderstandVisual />
				</Step>
				<Step
					n={3}
					color="bg-teal-50"
					title="Hear a short answer"
					text="Two or three plain sentences, spoken back and written on the watch."
				>
					<AnswerVisual />
				</Step>
			</ol>
		</section>
	);
}

function Step({
	n,
	color,
	title,
	text,
	children,
}: {
	n: number;
	color: string;
	title: string;
	text: string;
	children: ReactNode;
}) {
	return (
		<li className="flex">
			<Reveal delay={(n - 1) * 120} className="flex w-full">
				<article
					className={`flex w-full flex-col gap-6 rounded-4xl p-6 sm:p-8 ${color}`}
				>
					<div
						aria-hidden="true"
						className="flex h-44 items-center justify-center rounded-3xl bg-white/70 p-5"
					>
						{children}
					</div>
					<div className="flex flex-col gap-2">
						<p className="flex size-8 items-center justify-center rounded-full bg-heading text-sm font-medium text-white tabular-nums">
							<span className="sr-only">Step </span>
							{n}
						</p>
						<h3 className="text-subtitle text-balance text-heading">{title}</h3>
						<p className="text-pretty">{text}</p>
					</div>
				</article>
			</Reveal>
		</li>
	);
}

function AskVisual() {
	return (
		<div className="flex items-center gap-4">
			<span className="relative block size-16 shrink-0">
				<span className="orb-core" />
			</span>
			<div className="flex flex-col items-start gap-2">
				<span className="rounded-2xl rounded-bl-md bg-indigo-50 px-3.5 py-2 text-sm font-medium text-heading">
					How did I sleep?
				</span>
				<span className="flex h-5 items-center gap-1 pl-1">
					{[0, 1, 2, 3, 4, 5, 6].map((i) => (
						<span
							key={i}
							className="level-bar h-full w-1 rounded-full bg-indigo-500"
							style={{ animationDelay: `${i * 110}ms` }}
						/>
					))}
				</span>
			</div>
		</div>
	);
}

function UnderstandVisual() {
	return (
		<ul className="flex w-full max-w-64 flex-col gap-2 text-sm">
			{SHORT_NIGHT.contributors.map((c) => (
				<li
					key={c.label}
					className="flex items-center justify-between gap-3 rounded-full bg-white px-3.5 py-1.5"
				>
					<span className="font-medium text-heading">{c.label}</span>
					<span className="flex items-center gap-2 text-xs text-caption tabular-nums">
						{c.today} {c.unit}
						<span
							className={`rounded-full px-2 py-1 leading-none font-medium ${DELTA[contributorTone(c)]}`}
						>
							{formatDelta(c)}
						</span>
					</span>
				</li>
			))}
		</ul>
	);
}

function AnswerVisual() {
	return (
		<div className="flex max-w-64 flex-col gap-3">
			<p className="rounded-2xl rounded-br-md bg-white px-4 py-3 text-sm leading-5 font-medium text-heading">
				This looks like a lower day than usual, after a shorter night. An easier
				effort would suit you.
			</p>
			<span className="flex items-center gap-2 self-end text-xs font-medium text-teal-700">
				<SpeakerIcon size={18} />
				Example answer
			</span>
		</div>
	);
}
