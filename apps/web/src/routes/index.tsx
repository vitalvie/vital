import { createFileRoute } from "@tanstack/react-router";
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
import { askVital, synthesize, transcribe } from "#/lib/api";
import {
	canRecord,
	playMp3,
	type Recording,
	startRecording,
	stopAudio,
} from "#/lib/audio";
import { computeEnergy } from "#/lib/energy";
import {
	type Mic,
	micSupport,
	NOTICES,
	type Notice,
	type NoticeKind,
	noticeKind,
	VitalError,
} from "#/lib/notice";
import { getRelease } from "#/server/release";

export const Route = createFileRoute("/")({
	loader: () => getRelease(),
	component: Home,
});

function Home() {
	const release = Route.useLoaderData();
	const recording = useRef<Recording | null>(null);
	const input = useRef<HTMLInputElement>(null);
	const conversation = useRef<HTMLDivElement>(null);
	const [level, setLevel] = useState<(() => number) | undefined>();
	const [status, setStatus] = useState<Status>("idle");
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [problem, setProblem] = useState<NoticeKind | undefined>();
	const [mic, setMic] = useState<Mic>("ready");
	const [today, setToday] = useState<TodaySignals>(DEFAULT_TODAY);
	const [editing, setEditing] = useState(false);
	const prior = useRef<{ question: string; answer: string } | undefined>(
		undefined,
	);
	const days = useMemo(() => withToday(mockHealth, today), [today]);
	const energy = useMemo(() => computeEnergy(days), [days]);
	// A fresh problem wins; otherwise explain why the mic is unavailable.
	const kind = problem ?? (mic === "ready" ? undefined : mic);
	const notice: Notice | undefined = kind && NOTICES[kind];

	useEffect(
		() =>
			setMic(
				micSupport({ secure: window.isSecureContext, recorder: canRecord() }),
			),
		[],
	);

	// On phones the panel sits under the watch: keep the exchange in view as it grows.
	useEffect(() => {
		if (!question && !answer && !problem) return;
		conversation.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
		});
	}, [question, answer, problem]);

	async function attempt(task: () => Promise<void>) {
		setProblem(undefined);
		try {
			await task();
		} catch (e) {
			console.error(e);
			setProblem(noticeKind(e));
		} finally {
			setStatus("idle");
		}
	}

	async function respond(text: string) {
		const previous = prior.current;
		setQuestion(text);
		setAnswer("");
		setStatus("thinking");
		const reply = await askVital({
			question: text,
			today,
			...(previous ? { prior: previous } : {}),
		});
		prior.current = { question: text, answer: reply };
		setAnswer(reply);
		setStatus("speaking");
		try {
			await playMp3(await synthesize(reply));
		} catch (e) {
			// The written answer is already on screen; losing the voice is not an error.
			console.warn(e);
		}
	}

	function run(text: string) {
		if (text.trim() && status === "idle") attempt(() => respond(text));
	}

	function focusInput() {
		input.current?.focus();
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
				const heard = await transcribe(form);
				if (!heard) throw new VitalError("unheard");
				await respond(heard);
			});
		}
		if (status !== "idle") return;
		if (mic === "insecure" || mic === "unsupported") return focusInput();
		try {
			const rec = await startRecording();
			recording.current = rec;
			setLevel(() => rec.level);
			setProblem(undefined);
			setMic("ready");
			setStatus("listening");
		} catch {
			setMic("blocked");
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
		<main className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-8 pt-[max(1.5rem,env(safe-area-inset-top))] pr-[max(1.25rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))] sm:gap-12 sm:px-8 sm:py-8 lg:gap-14">
			<header>
				<Logo />
			</header>

			{/* DOM order is the phone order: intro, watch, answer, then the data. */}
			<div className="grid grid-cols-[minmax(0,1fr)] gap-6 sm:gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-16 lg:gap-y-6">
				<section className="flex flex-col gap-2 text-center lg:col-start-2 lg:row-start-1 lg:text-left">
					<h1 className="text-[28px] leading-9 font-medium text-heading sm:text-[32px] sm:leading-10">
						Talk to your body.
					</h1>
					<p className="leading-6 text-pretty">
						Tap the watch and ask out loud, or pick a question.
					</p>
				</section>

				<div className="flex justify-center lg:sticky lg:top-8 lg:col-start-1 lg:row-span-4 lg:row-start-1 lg:self-start">
					<Watch
						status={status}
						level={level}
						battery={energy.score}
						mic={mic}
						onOrb={onOrb}
						onCancel={onCancel}
					/>
				</div>

				<div
					ref={conversation}
					className="animate-fade-up scroll-mb-4 lg:col-start-2 lg:row-start-4 lg:[animation-delay:160ms]"
				>
					<Conversation
						status={status}
						question={question}
						answer={answer}
						notice={notice}
						inputRef={input}
						onAsk={run}
						onRetry={() => run(question)}
						onType={focusInput}
					/>
				</div>

				<section
					aria-labelledby="demo-data-title"
					className="flex flex-col gap-3 lg:col-start-2 lg:row-start-2"
				>
					<p className="text-sm leading-5 text-caption">
						<span id="demo-data-title" className="font-medium text-heading">
							Demo data.
						</span>{" "}
						Change the sample day, then ask again.
					</p>
					<div className="flex flex-wrap items-center gap-2">
						<PresetList today={today} onChange={setToday} />
						<button
							type="button"
							aria-expanded={editing}
							aria-controls="demo-data"
							onClick={() => setEditing((open) => !open)}
							className={`flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-sm pointer-coarse:min-h-11 font-medium transition duration-200 ease-smooth active:scale-[0.97] ${
								editing
									? "bg-indigo-500 text-white"
									: "bg-white text-heading shadow-soft hover:bg-indigo-50"
							}`}
						>
							<SlidersIcon />
							Adjust numbers
						</button>
					</div>
					{editing && (
						<div className="mt-1">
							<DemoDataPanel
								id="demo-data"
								days={days}
								today={today}
								onChange={setToday}
								onClose={() => setEditing(false)}
							/>
						</div>
					)}
				</section>

				<div className="animate-fade-up [animation-delay:80ms] lg:col-start-2 lg:row-start-3">
					<BodyBatteryCard energy={energy} />
				</div>
			</div>

			<footer className="mt-auto text-center text-xs leading-5 text-caption text-pretty">
				Vital is not a medical device and does not give diagnoses. For health
				concerns, talk to a healthcare professional.
				<ReleaseFooter release={release} />
			</footer>
		</main>
	);
}
