import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { AskBar } from "#/components/ask-bar";
import { BodyBatteryCard } from "#/components/body-battery-card";
import type { Status } from "#/components/orb";
import { Watch } from "#/components/watch";
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

	function onCancel() {
		if (status === "speaking") return stopAudio();
		if (status === "listening" && recording.current) {
			recording.current.stop();
			recording.current = null;
			setLevel(undefined);
			setStatus("idle");
		}
	}

	return (
		<main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-6">
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
				<h1 className="text-[26px] leading-8 font-medium text-heading sm:text-[32px] sm:leading-10">
					Your health, explained out loud.
				</h1>
				<p className="leading-6">
					Ask anything about your sleep, recovery or energy.{" "}
					<br className="max-sm:hidden" />
					Vital answers using your own data, compared to your usual.
				</p>
			</section>

			<div className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
				<div className="flex justify-center lg:sticky lg:top-6">
					<Watch
						status={status}
						level={level}
						battery={energy.score}
						voice={voice}
						onOrb={onOrb}
						onCancel={onCancel}
					/>
				</div>

				<div className="flex flex-col gap-8">
					<section className="flex min-h-40 flex-col justify-center gap-3 rounded-3xl bg-white p-6 shadow-soft">
						{question || error ? (
							<>
								{question && (
									<p
										key={question}
										className="animate-fade-up text-sm text-caption"
									>
										“{question}”
									</p>
								)}
								{status === "thinking" && !answer && (
									<p className="text-caption">Thinking…</p>
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
							</>
						) : (
							<p className="text-center text-caption">
								Tap the watch and ask how you're doing.
							</p>
						)}
					</section>
					<AskBar onAsk={run} />
					<BodyBatteryCard energy={energy} />
				</div>
			</div>

			<footer className="mt-auto text-center text-xs leading-5 text-caption">
				Vital is not a medical device and does not give diagnoses. For health
				concerns, talk to a healthcare professional.
			</footer>
		</main>
	);
}
