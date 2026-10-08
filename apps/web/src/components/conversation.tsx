import type { Notice } from "#/lib/notice";
import { focusAskInput } from "#/lib/use-vital";
import { AskBar } from "./ask-bar";
import { NoticeCard } from "./notice-card";
import type { Status } from "./orb";

const STATUS: Record<Status, { label: string; dot: string }> = {
	idle: { label: "Ready", dot: "bg-good" },
	listening: { label: "Listening", dot: "bg-bad animate-pulse" },
	thinking: { label: "Thinking", dot: "bg-indigo-500 animate-pulse" },
	speaking: { label: "Speaking", dot: "bg-indigo-500 animate-pulse" },
};

type Props = {
	status: Status;
	question: string;
	answer: string;
	notice?: Notice;
	onAsk: (text: string) => void;
	onRetry: () => void;
};

// The written side of the exchange: what was asked, what Vital said, and a way to type.
export function Conversation({
	status,
	question,
	answer,
	notice,
	onAsk,
	onRetry,
}: Props) {
	const { label, dot } = STATUS[status];
	const waiting = status === "thinking" && !answer;

	return (
		<section
			aria-labelledby="ask-vital"
			className="flex flex-col rounded-4xl bg-white shadow-soft"
		>
			<header className="flex items-center justify-between px-5 pt-5 sm:px-7 sm:pt-6">
				<h3 id="ask-vital" className="text-sm font-medium text-caption">
					Ask Vital
				</h3>
				<output className="flex items-center gap-2 text-xs font-medium text-caption">
					<span className={`size-2 rounded-full ${dot}`} aria-hidden="true" />
					{label}
				</output>
			</header>

			<div className="flex min-h-28 flex-col justify-center gap-4 px-5 py-5 sm:px-7">
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
					<NoticeCard
						notice={notice}
						live
						onRetry={onRetry}
						onType={focusAskInput}
					/>
				)}
			</div>

			<div className="rounded-b-4xl bg-cream/60 p-4 sm:p-5">
				<AskBar busy={status !== "idle"} onAsk={onAsk} />
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
