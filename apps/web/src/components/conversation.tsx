import type { Ref } from "react";
import type { Notice } from "#/lib/notice";
import { AskBar } from "./ask-bar";
import type { Status } from "./orb";

const STATUS: Record<Status, { label: string; dot: string }> = {
	idle: { label: "Ready", dot: "bg-good" },
	listening: { label: "Listening", dot: "bg-bad animate-pulse" },
	thinking: { label: "Thinking", dot: "bg-indigo-500 animate-pulse" },
	speaking: { label: "Speaking", dot: "bg-indigo-500 animate-pulse" },
};

const ACTION_LABEL = {
	retry: "Try again",
	type: "Type instead",
	secure: "Open secure link",
};

type Props = {
	status: Status;
	question: string;
	answer: string;
	notice?: Notice;
	inputRef?: Ref<HTMLInputElement>;
	onAsk: (text: string) => void;
	onRetry: () => void;
	onType: () => void;
};

export function Conversation({
	status,
	question,
	answer,
	notice,
	inputRef,
	onAsk,
	onRetry,
	onType,
}: Props) {
	const { label, dot } = STATUS[status];
	const waiting = status === "thinking" && !answer;

	return (
		<section
			aria-labelledby="ask-vital"
			className="flex flex-col rounded-3xl bg-white shadow-soft"
		>
			<header className="flex items-center justify-between px-5 pt-5 sm:px-6">
				<h2 id="ask-vital" className="text-sm font-medium text-caption">
					Ask Vital
				</h2>
				<output className="flex items-center gap-2 text-xs font-medium text-caption">
					<span className={`size-2 rounded-full ${dot}`} aria-hidden="true" />
					{label}
				</output>
			</header>

			<div className="flex min-h-28 flex-col justify-center gap-4 px-5 py-5 sm:px-6">
				{question ? (
					<p
						key={question}
						className="animate-fade-up max-w-[85%] self-end rounded-2xl rounded-br-md bg-indigo-50 px-4 py-2 wrap-anywhere text-heading"
					>
						<span className="sr-only">You asked: </span>
						{question}
					</p>
				) : (
					!notice && (
						<p className="text-center text-caption text-pretty">
							Ask out loud, or pick a question below.
						</p>
					)
				)}
				<div aria-live="polite">
					{answer && (
						<p
							key={answer}
							className="animate-fade-up text-lg leading-7 text-pretty wrap-anywhere text-heading"
						>
							{answer}
						</p>
					)}
				</div>
				{waiting && <AnswerSkeleton />}
				{notice && (
					<NoticeCard notice={notice} onRetry={onRetry} onType={onType} />
				)}
			</div>

			<div className="border-t border-line p-4 sm:p-5">
				<AskBar busy={status !== "idle"} inputRef={inputRef} onAsk={onAsk} />
			</div>
		</section>
	);
}

// Holds the space the answer will take, so nothing jumps when it lands.
function AnswerSkeleton() {
	return (
		<div aria-hidden="true" className="flex animate-pulse flex-col gap-3 py-1">
			<span className="h-4 w-11/12 rounded-full bg-indigo-50" />
			<span className="h-4 w-4/5 rounded-full bg-indigo-50" />
			<span className="h-4 w-1/2 rounded-full bg-indigo-50" />
		</div>
	);
}

function NoticeCard({
	notice,
	onRetry,
	onType,
}: {
	notice: Notice;
	onRetry: () => void;
	onType: () => void;
}) {
	const action =
		"flex min-h-9 items-center rounded-full bg-white px-3.5 text-sm pointer-coarse:min-h-11 font-medium text-heading shadow-soft transition duration-200 ease-smooth hover:bg-indigo-50 active:scale-[0.97]";
	return (
		<div
			role="alert"
			className="animate-fade-up flex flex-col items-start gap-3 rounded-2xl bg-peach p-4"
		>
			<div>
				<p className="font-medium text-heading">{notice.title}</p>
				<p className="mt-1 text-sm leading-5 text-pretty">{notice.hint}</p>
			</div>
			{notice.action === "secure" ? (
				<a href={secureUrl()} className={action}>
					{ACTION_LABEL.secure}
				</a>
			) : (
				notice.action && (
					<button
						type="button"
						onClick={notice.action === "retry" ? onRetry : onType}
						className={action}
					>
						{ACTION_LABEL[notice.action]}
					</button>
				)
			)}
		</div>
	);
}

function secureUrl() {
	if (typeof window === "undefined") return "/";
	return `https://${window.location.host}${window.location.pathname}`;
}
