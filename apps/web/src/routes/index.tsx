import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { BodyBatteryCard } from "#/components/body-battery-card";
import { Conversation } from "#/components/conversation";
import { DemoDataPanel, PresetList } from "#/components/demo-data-panel";
import { SlidersIcon } from "#/components/icons";
import { Logo } from "#/components/logo";
import type { Status } from "#/components/orb";
import { ReleaseFooter } from "#/components/release-footer";
import { Watch } from "#/components/watch";
import {
	DEFAULT_TODAY,
	mockHealth,
	type TodaySignals,
	withToday,
} from "#/data/mock-health";
import {
	canRecord,
	playMp3,
	type Recording,
	startRecording,
	stopAudio,
} from "#/lib/audio";
import { computeEnergy } from "#/lib/energy";
import { askVital } from "#/server/ask";
import { getRelease } from "#/server/release";
import { synthesize, transcribe } from "#/server/voice";

export const Route = createFileRoute("/")({
	loader: () => getRelease(),
	component: Home,
});

function Home() {
	const release = Route.useLoaderData();
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
	const [today, setToday] = useState<TodaySignals>(DEFAULT_TODAY);
	const [editing, setEditing] = useState(false);
	const days = useMemo(() => withToday(mockHealth, today), [today]);
	const energy = useMemo(() => computeEnergy(days), [days]);

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
		const reply = await ask({ data: { question: text, today } });
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
			<header>
				<Logo />
			</header>

			<div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-16 lg:gap-y-6">
				<section className="flex flex-col gap-4 text-center lg:col-start-2 lg:text-left">
					<div className="flex flex-col gap-2">
						<h1 className="text-[26px] leading-8 font-medium text-heading sm:text-[32px] sm:leading-10">
							Talk to your body.
						</h1>
						<p className="leading-6">
							Tap the watch and ask out loud, or pick a question.
						</p>
					</div>
					<div className="flex flex-col items-center gap-3 lg:items-start">
						<p className="text-sm leading-5 text-caption">
							<span className="font-medium text-heading">Demo data.</span>{" "}
							Change the sample day, then ask again.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
							<PresetList today={today} onChange={setToday} />
							<button
								type="button"
								aria-expanded={editing}
								aria-controls="demo-data"
								onClick={() => setEditing((open) => !open)}
								className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-indigo-500 ${
									editing
										? "bg-indigo-500 text-white"
										: "bg-white text-heading shadow-soft hover:bg-indigo-50"
								}`}
							>
								<SlidersIcon />
								Adjust numbers
							</button>
						</div>
					</div>
				</section>

				{editing && (
					<div className="lg:col-start-2">
						<DemoDataPanel
							id="demo-data"
							days={days}
							today={today}
							onChange={setToday}
							onClose={() => setEditing(false)}
						/>
					</div>
				)}

				<div
					className={`flex justify-center lg:sticky lg:top-6 lg:col-start-1 lg:row-start-1 lg:self-start ${editing ? "lg:row-span-4" : "lg:row-span-3"}`}
				>
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
				<ReleaseFooter release={release} />
			</footer>
		</main>
	);
}
