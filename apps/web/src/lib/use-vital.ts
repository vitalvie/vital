import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Status } from "#/components/orb";
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
import {
	type Mic,
	micSupport,
	NOTICES,
	type Notice,
	type NoticeKind,
	noticeKind,
	VitalError,
} from "#/lib/notice";
import { askVital } from "#/server/ask";
import { synthesize, transcribe } from "#/server/voice";

// The text input that takes over when voice is unavailable.
export const ASK_INPUT_ID = "ask-input";

export function focusAskInput() {
	document.getElementById(ASK_INPUT_ID)?.focus();
}

// The voice session behind the demo: recording, asking, speaking, and what went wrong.
export function useVital() {
	const askServer = useServerFn(askVital);
	const toText = useServerFn(transcribe);
	const toSpeech = useServerFn(synthesize);
	const recording = useRef<Recording | null>(null);
	const [level, setLevel] = useState<(() => number) | undefined>();
	const [status, setStatus] = useState<Status>("idle");
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [problem, setProblem] = useState<NoticeKind | undefined>();
	const [mic, setMic] = useState<Mic>("ready");
	const [today, setToday] = useState<TodaySignals>(DEFAULT_TODAY);
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
		const reply = await askServer({
			data: {
				question: text,
				today,
				...(previous ? { prior: previous } : {}),
			},
		});
		prior.current = { question: text, answer: reply };
		setAnswer(reply);
		setStatus("speaking");
		try {
			await playMp3(await toSpeech({ data: reply }));
		} catch (e) {
			// The written answer is already on screen; losing the voice is not an error.
			console.warn(e);
		}
	}

	function ask(text: string) {
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
				if (!heard) throw new VitalError("unheard");
				await respond(heard);
			});
		}
		if (status !== "idle") return;
		if (mic === "insecure" || mic === "unsupported") return focusAskInput();
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

	return {
		status,
		level,
		question,
		answer,
		notice,
		mic,
		today,
		setToday,
		days,
		energy,
		ask,
		retry: () => ask(question),
		onOrb,
		onCancel,
	};
}

export type Vital = ReturnType<typeof useVital>;
