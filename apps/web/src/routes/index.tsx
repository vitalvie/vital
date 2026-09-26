import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { type FormEvent, useEffect, useState } from "react";
import { mockHealth } from "#/data/mock-health";
import { type Contributor, computeEnergy } from "#/lib/energy";
import { canListen, listen, speak } from "#/lib/speech";
import { askVital } from "#/server/ask";

export const Route = createFileRoute("/")({ component: Home });

type Status = "idle" | "listening" | "thinking" | "speaking";

const STATUS_LABEL: Record<Status, string> = {
	idle: "Tap and ask about your health",
	listening: "Listening…",
	thinking: "Thinking…",
	speaking: "Speaking… tap to stop",
};

const SUGGESTIONS = [
	{ text: "How am I doing today?", color: "bg-indigo-50" },
	{ text: "How did I sleep?", color: "bg-pink-50" },
	{ text: "Should I train hard today?", color: "bg-teal-50" },
];

const energy = computeEnergy(mockHealth);

function Home() {
	const ask = useServerFn(askVital);
	const [status, setStatus] = useState<Status>("idle");
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [error, setError] = useState("");
	const [voice, setVoice] = useState(false);
	const [draft, setDraft] = useState("");

	useEffect(() => setVoice(canListen()), []);

	async function run(text: string) {
		if (!text.trim() || status !== "idle") return;
		setQuestion(text);
		setAnswer("");
		setError("");
		try {
			setStatus("thinking");
			const reply = await ask({ data: text });
			setAnswer(reply);
			setStatus("speaking");
			await speak(reply);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setStatus("idle");
		}
	}

	async function onMic() {
		if (status === "speaking") {
			speechSynthesis.cancel();
			return;
		}
		if (status !== "idle") return;
		setStatus("listening");
		const heard = await listen().catch(() => "");
		setStatus("idle");
		if (heard) run(heard);
	}

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		run(draft);
		setDraft("");
	}

	return (
		<main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-10 px-6 py-8">
			<header className="flex items-center justify-between">
				<img
					src="/vital-logo.png"
					alt="Vital, built for Alan"
					className="h-8 w-auto"
				/>
				<span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
					Demo data
				</span>
			</header>

			<section className="flex flex-col gap-3">
				<h1 className="text-[32px] leading-10 font-medium text-heading">
					Your health, explained out loud.
				</h1>
				<p className="leading-6">
					Ask anything about your sleep, recovery or energy. Vital answers using
					your own data, compared to your usual.
				</p>
			</section>

			<section className="relative rounded-3xl bg-linear-to-br from-indigo-50 to-blue-50 p-6 sm:p-8">
				<div className="absolute -top-5 right-6 rounded-2xl bg-peach px-4 py-3 shadow-sm">
					<p className="font-medium text-heading">
						{energy.today.sleepHours} h
					</p>
					<p className="text-sm text-caption">slept last night</p>
				</div>
				<p className="font-medium text-caption">Body Battery</p>
				<p className="mt-1 text-7xl font-bold text-indigo-500">
					{energy.score}
					<span className="text-2xl font-medium text-caption">/100</span>
				</p>
				<div className="mt-6 grid grid-cols-3 gap-3">
					{energy.contributors.map((c) => (
						<StatCard key={c.label} contributor={c} />
					))}
				</div>
			</section>

			<section className="flex flex-col items-center gap-5">
				<button
					type="button"
					onClick={onMic}
					disabled={!voice || status === "thinking"}
					aria-label="Ask Vital"
					className={`flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500 text-white shadow-[0_12px_32px_rgba(92,89,243,0.35)] transition hover:bg-indigo-700 disabled:opacity-40 ${
						status === "listening" ? "animate-pulse ring-8 ring-indigo-100" : ""
					}`}
				>
					<MicIcon />
				</button>
				<p className="text-sm text-caption">
					{voice ? STATUS_LABEL[status] : "Voice needs Chrome, Edge or Safari"}
				</p>
				<div className="flex flex-wrap justify-center gap-2">
					{SUGGESTIONS.map((s) => (
						<button
							key={s.text}
							type="button"
							onClick={() => run(s.text)}
							className={`rounded-full px-4 py-2 text-sm font-medium text-heading transition hover:brightness-95 ${s.color}`}
						>
							{s.text}
						</button>
					))}
				</div>
				<form onSubmit={onSubmit} className="flex w-full gap-2">
					<input
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						placeholder="Or type a question…"
						className="h-12 flex-1 rounded-2xl border border-line bg-white px-4 text-heading outline-none placeholder:text-caption focus:border-indigo-500"
					/>
					<button
						type="submit"
						className="h-12 rounded-2xl bg-indigo-500 px-5 font-medium text-white transition hover:bg-indigo-700"
					>
						Ask
					</button>
				</form>
			</section>

			{(question || error) && (
				<section className="flex flex-col gap-2 rounded-3xl bg-peach p-6">
					{question && <p className="text-sm text-caption">“{question}”</p>}
					{answer && <p className="text-lg leading-7 text-heading">{answer}</p>}
					{error && <p className="text-bad">{error}</p>}
				</section>
			)}

			<footer className="mt-auto text-center text-xs leading-5 text-caption">
				Vital is not a medical device and does not give diagnoses. For health
				concerns, talk to a healthcare professional.
			</footer>
		</main>
	);
}

function StatCard({ contributor: c }: { contributor: Contributor }) {
	const sign = c.impact > 0 ? "+" : "";
	const pill = c.impact < 0 ? "bg-bad-bg text-bad" : "bg-good-bg text-good";
	return (
		<div className="flex flex-col gap-1 rounded-2xl bg-white p-4">
			<p className="text-sm text-caption">{c.label}</p>
			<p className="text-2xl font-medium text-heading">
				{c.today}
				<span className="text-sm text-caption"> {c.unit}</span>
			</p>
			<p className="text-xs text-caption">
				usual {c.baseline} {c.unit}
			</p>
			<span
				className={`mt-1 w-fit rounded-full px-2 py-0.5 text-xs font-medium ${pill}`}
			>
				{sign}
				{c.impact} pts
			</span>
		</div>
	);
}

function MicIcon() {
	return (
		<svg
			width="36"
			height="36"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect x="9" y="3" width="6" height="11" rx="3" />
			<path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
		</svg>
	);
}
