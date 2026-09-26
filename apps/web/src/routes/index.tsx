import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { BodyBatteryCard } from "#/components/body-battery-card";
import { Conversation } from "#/components/conversation";
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
		<main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-5 py-6 sm:gap-12 sm:px-8 sm:py-8 lg:gap-16">
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

			<div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-16 lg:gap-y-6">
				<section className="flex flex-col gap-2 text-center lg:col-start-2 lg:text-left">
					<p className="text-sm font-medium text-indigo-500">
						Your daily check-in
					</p>
					<h1 className="text-[26px] leading-8 font-medium text-heading sm:text-[32px] sm:leading-10">
						Your health, explained out loud.
					</h1>
					<p className="leading-6">
						Ask anything about your sleep, recovery or energy. Vital answers
						using your own data, compared to your usual.
					</p>
				</section>

				<div className="flex justify-center lg:sticky lg:top-6 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:self-start">
					<Watch
						status={status}
						level={level}
						battery={energy.score}
						voice={voice}
						onOrb={onOrb}
						onCancel={onCancel}
					/>
				</div>

				<div className="lg:col-start-2">
					<BodyBatteryCard energy={energy} />
				</div>

				<div className="lg:col-start-2">
					<Conversation
						status={status}
						question={question}
						answer={answer}
						error={error}
						onAsk={run}
					/>
				</div>
			</div>

			<footer className="mt-auto text-center text-xs leading-5 text-caption">
				Vital is not a medical device and does not give diagnoses. For health
				concerns, talk to a healthcare professional.
			</footer>
		</main>
	);
}
