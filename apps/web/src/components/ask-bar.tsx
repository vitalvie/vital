import { type FormEvent, useState } from "react";
import { ASK_INPUT_ID } from "#/lib/use-vital";
import { ArrowUpIcon } from "./icons";

export const SUGGESTIONS = [
	{ text: "How am I doing today?", color: "bg-indigo-50" },
	{ text: "How did I sleep?", color: "bg-pink-50" },
	{ text: "Should I train hard today?", color: "bg-teal-50" },
];

type Props = {
	// Vital is listening, thinking or speaking: nothing new can be sent yet.
	busy: boolean;
	onAsk: (text: string) => void;
};

export function AskBar({ busy, onAsk }: Props) {
	const [draft, setDraft] = useState("");

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		if (busy || !draft.trim()) return;
		onAsk(draft);
		setDraft("");
	}

	return (
		<div className="flex flex-col gap-3">
			<ul className="flex flex-wrap gap-2" aria-label="Suggested questions">
				{SUGGESTIONS.map((s) => (
					<li key={s.text}>
						<button
							type="button"
							disabled={busy}
							onClick={() => onAsk(s.text)}
							className={`chip hover:shadow-soft ${s.color}`}
						>
							{s.text}
						</button>
					</li>
				))}
			</ul>
			<form
				onSubmit={onSubmit}
				className="flex w-full items-center rounded-full bg-cream-deep p-1.5 pl-5 transition duration-150 ease-smooth focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500"
			>
				<input
					id={ASK_INPUT_ID}
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					placeholder="Or type a question…"
					aria-label="Type a question"
					autoComplete="off"
					enterKeyHint="send"
					className="h-11 min-w-0 flex-1 bg-transparent text-heading outline-none placeholder:text-caption"
				/>
				<button
					type="submit"
					aria-label="Send question"
					disabled={busy || !draft.trim()}
					className="flex size-11 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white transition duration-150 ease-smooth hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-100 disabled:text-indigo-300"
				>
					<ArrowUpIcon />
				</button>
			</form>
		</div>
	);
}
