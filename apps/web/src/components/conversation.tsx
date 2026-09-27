import { AskBar } from "./ask-bar";
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
	error: string;
	onAsk: (text: string) => void;
};

export function Conversation({
	status,
	question,
	answer,
	error,
	onAsk,
}: Props) {
	const { label, dot } = STATUS[status];

	return (
		<section className="flex flex-col rounded-3xl bg-white shadow-soft">
			<header className="flex items-center justify-between px-5 pt-5 sm:px-6">
				<h2 className="text-sm font-medium text-caption">Ask Vital</h2>
				<span className="flex items-center gap-2 text-xs font-medium text-caption">
					<span className={`size-2 rounded-full ${dot}`} />
					{label}
				</span>
			</header>

			<div className="flex min-h-40 flex-col justify-center gap-4 px-5 py-6 sm:px-6">
				{question ? (
					<>
						<p
							key={question}
							className="animate-fade-up max-w-[85%] self-end rounded-2xl rounded-br-md bg-indigo-50 px-4 py-2 text-heading"
						>
							{question}
						</p>
						{answer ? (
							<p
								key={answer}
								className="animate-fade-up text-lg leading-7 text-heading"
							>
								{answer}
							</p>
						) : (
							!error && <TypingDots />
						)}
					</>
				) : (
					<p className="text-center text-caption">Your answer shows up here.</p>
				)}
				{error && <p className="animate-fade-up text-bad">{error}</p>}
			</div>

			<div className="border-t border-line p-4 sm:p-5">
				<AskBar onAsk={onAsk} />
			</div>
		</section>
	);
}

function TypingDots() {
	return (
		<output className="flex gap-1.5" aria-label="Thinking">
			{[0, 1, 2].map((i) => (
				<span
					key={i}
					className="size-2 animate-bounce rounded-full bg-indigo-300"
					style={{ animationDelay: `${i * 150}ms` }}
				/>
			))}
		</output>
	);
}
