import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { AskBar } from "#/components/ask-bar";
import { BodyBatteryCard } from "#/components/body-battery-card";
import { Orb, type Status } from "#/components/orb";
import { mockHealth } from "#/data/mock-health";
import {
	canRecord,
	playMp3,
	type Recording,
	startRecording,
	stopAudio,
} from "#/lib/audio";
import { computeEnergy } from "#/lib/energy";
import { askVital } from "#/server/ask";
import { synthesize, transcribe } from "#/server/voice";

export const Route = createFileRoute("/")({ component: Home });

const STATUS_LABEL: Record<Status, string> = {
	idle: "Tap the orb and ask about your health",
	listening: "Listening… tap to send",
	thinking: "Thinking…",
	speaking: "Speaking… tap to stop",
};

const energy = computeEnergy(mockHealth);

function Home() {
	const ask = useServerFn(askVital);
	const toText = useServerFn(transcribe);
	const toSpeech = useServerFn(synthesize);
	const recording = useRef<Recording | null>(null);
	const [level, setLevel] = useState<(() => number) | undefined>();
	const [status, setStatus] = useState<Status>("idle");
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [error, setError] = useState("");
	const [voice, setVoice] = useState(false);

	useEffect(() => setVoice(canRecord()), []);

	async function attempt(task: () => Promise<void>) {
		setError("");
		try {
			await task();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setStatus("idle");
		}
	}

	async function respond(text: string) {
		setQuestion(text);
		setAnswer("");
		setStatus("thinking");
		const reply = await ask({ data: text });
		setAnswer(reply);
		setStatus("speaking");
		await playMp3(await toSpeech({ data: reply }));
	}

	function run(text: string) {
		if (text.trim() && status === "idle") attempt(() => respond(text));
	}

	async function onOrb() {
		if (status === "speaking") return stopAudio();
		if (status === "listening" && recording.current) {
			const rec = recording.current;
			recording.current = null;
			setLevel(undefined);
			return attempt(async () => {
				setStatus("thinking");
				const form = new FormData();
				form.append("audio", await rec.stop());
				const heard = await toText({ data: form });
				if (!heard) throw new Error("I didn't catch that. Try again.");
				await respond(heard);
			});
		}
		if (status !== "idle") return;
		try {
			const rec = await startRecording();
			recording.current = rec;
			setLevel(() => rec.level);
			setError("");
			setStatus("listening");
		} catch {
			setError("Microphone access was denied.");
		}
	}

	return (
		<main className="mx-auto flex min-h-screen max-w-xl flex-col gap-10 px-6 py-6">
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

			<section className="flex flex-col gap-2 text-center">
				<h1 className="text-[32px] leading-10 font-medium text-heading">
					Your health, explained out loud.
				</h1>
				<p className="leading-6">
					Ask anything about your sleep, recovery or energy.
					<br />
					Vital answers using your own data, compared to your usual.
				</p>
			</section>

			<BodyBatteryCard energy={energy} />

			<section className="flex flex-col items-center gap-6 py-4">
				<Orb
					status={status}
					level={level}
					disabled={!voice && status === "idle"}
					onClick={onOrb}
				/>
				<p className="text-sm text-caption">
					{voice || status !== "idle"
						? STATUS_LABEL[status]
						: "Mic needs HTTPS or localhost"}
				</p>
			</section>

			{(question || error) && (
				<section className="flex flex-col items-center gap-3 text-center">
					{question && (
						<p key={question} className="animate-fade-up text-sm text-caption">
							“{question}”
						</p>
					)}
					{answer && (
						<p
							key={answer}
							className="animate-fade-up text-xl leading-8 text-heading"
						>
							{answer}
						</p>
					)}
					{error && <p className="animate-fade-up text-bad">{error}</p>}
				</section>
			)}

			<AskBar onAsk={run} />

			<footer className="mt-auto text-center text-xs leading-5 text-caption">
				Vital is not a medical device and does not give diagnoses. For health
				concerns, talk to a healthcare professional.
			</footer>
		</main>
	);
}
