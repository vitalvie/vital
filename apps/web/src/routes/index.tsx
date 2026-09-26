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
	speaking: "Speaking…",
};

const SUGGESTIONS = [
	"How am I doing today?",
	"How did I sleep?",
	"Should I train hard today?",
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
		<main className="mx-auto flex min-h-screen max-w-xl flex-col gap-8 px-6 py-10">
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<img src="/vital-logo.png" alt="" className="h-9 w-9 rounded-lg" />
					<span className="text-xl font-semibold">Vital</span>
				</div>
				<span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">
					Demo data
				</span>
			</header>

			<section className="flex flex-col items-center gap-2">
				<p className="text-sm tracking-widest text-white/50 uppercase">
					Body Battery
				</p>
				<p className="text-7xl font-bold text-brand-light">{energy.score}</p>
				<div className="grid w-full grid-cols-3 gap-3 pt-4">
					{energy.contributors.map((c) => (
						<StatCard key={c.label} contributor={c} />
					))}
				</div>
			</section>

			<section className="flex flex-col items-center gap-4">
				<button
					type="button"
					onClick={onMic}
					disabled={!voice || status === "thinking"}
					aria-label="Ask Vital"
					className={`flex h-28 w-28 items-center justify-center rounded-full bg-brand text-5xl shadow-lg shadow-brand/40 transition hover:scale-105 disabled:opacity-40 ${
						status === "listening" ? "animate-pulse" : ""
					}`}
				>
					🎙️
				</button>
				<p className="text-sm text-white/60">
					{voice ? STATUS_LABEL[status] : "Voice needs Chrome, Edge or Safari"}
				</p>
				<div className="flex flex-wrap justify-center gap-2">
					{SUGGESTIONS.map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => run(s)}
							className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/80 hover:bg-white/10"
						>
							{s}
						</button>
					))}
				</div>
				<form onSubmit={onSubmit} className="flex w-full gap-2">
					<input
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						placeholder="Or type a question…"
						className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 outline-none focus:border-brand-light"
					/>
					<button
						type="submit"
						className="rounded-xl bg-white/10 px-4 hover:bg-white/20"
					>
						Ask
					</button>
				</form>
			</section>

			{(question || error) && (
				<section className="flex flex-col gap-3 rounded-2xl bg-white/5 p-5">
					{question && <p className="text-white/60">“{question}”</p>}
					{answer && <p className="text-lg leading-relaxed">{answer}</p>}
					{error && <p className="text-red-400">{error}</p>}
				</section>
			)}

			<footer className="mt-auto text-center text-xs text-white/40">
				Vital is not a medical device and does not give diagnoses. For health
				concerns, talk to a healthcare professional.
			</footer>
		</main>
	);
}

function StatCard({ contributor: c }: { contributor: Contributor }) {
	const sign = c.impact > 0 ? "+" : "";
	const color = c.impact < 0 ? "text-rose-400" : "text-emerald-400";
	return (
		<div className="rounded-2xl bg-white/5 p-3 text-center">
			<p className="text-xs text-white/50">{c.label}</p>
			<p className="text-xl font-semibold">
				{c.today}
				<span className="text-sm text-white/50"> {c.unit}</span>
			</p>
			<p className="text-xs text-white/40">
				avg {c.baseline} {c.unit}
			</p>
			<p className={`text-xs font-medium ${color}`}>
				{sign}
				{c.impact} pts
			</p>
		</div>
	);
}
