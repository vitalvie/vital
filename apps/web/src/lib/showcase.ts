import { useEffect, useState } from "react";
import type { Status } from "#/components/orb";

// A scripted exchange that plays on the hero watch. It shows the product; it is not a live answer.

export type ShowcaseFrame = {
	status: Status;
	question: string;
	answer: string;
};

export const SHOWCASE_QUESTION = "How did I sleep?";
export const SHOWCASE_ANSWER =
	"This looks like a longer night than usual. Keeping that bedtime would suit you.";

// When each state starts, in milliseconds. The loop restarts at SHOWCASE_LENGTH.
const TIMELINE: { from: number; status: Status }[] = [
	{ from: 0, status: "idle" },
	{ from: 2200, status: "listening" },
	{ from: 4600, status: "thinking" },
	{ from: 5800, status: "speaking" },
];

export const SHOWCASE_LENGTH = 11_000;

// The frame shown without motion: the answer, already on screen.
export const SHOWCASE_STILL: ShowcaseFrame = {
	status: "idle",
	question: SHOWCASE_QUESTION,
	answer: SHOWCASE_ANSWER,
};

export function showcaseFrame(elapsedMs: number): ShowcaseFrame {
	const t = ((elapsedMs % SHOWCASE_LENGTH) + SHOWCASE_LENGTH) % SHOWCASE_LENGTH;
	let status = TIMELINE[0].status;
	for (const step of TIMELINE) if (t >= step.from) status = step.status;
	return {
		status,
		question: status === "idle" ? "" : SHOWCASE_QUESTION,
		answer: status === "speaking" ? SHOWCASE_ANSWER : "",
	};
}

// A gentle fake mic level, so the orb moves while "listening".
export function showcaseLevel(): number {
	return 0.35 + 0.3 * Math.sin(performance.now() / 180);
}

// Plays the loop. Under reduced motion it holds the still frame.
export function useShowcase(): ShowcaseFrame {
	const [frame, setFrame] = useState<ShowcaseFrame>(() => showcaseFrame(0));

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setFrame(SHOWCASE_STILL);
			return;
		}
		const start = performance.now();
		const id = setInterval(() => {
			const next = showcaseFrame(performance.now() - start);
			setFrame((current) => (current.status === next.status ? current : next));
		}, 200);
		return () => clearInterval(id);
	}, []);

	return frame;
}
