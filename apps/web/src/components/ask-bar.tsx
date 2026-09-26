import { type FormEvent, useState } from "react";
import { ArrowUpIcon } from "./icons";

const SUGGESTIONS = [
	{ text: "How am I doing today?", color: "bg-indigo-50" },
	{ text: "How did I sleep?", color: "bg-pink-50" },
	{ text: "Should I train hard today?", color: "bg-teal-50" },
];

export function AskBar({ onAsk }: { onAsk: (text: string) => void }) {
	const [draft, setDraft] = useState("");

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		onAsk(draft);
		setDraft("");
	}

	return (
		<div className="flex flex-col items-center gap-3">
			<div className="flex flex-wrap justify-center gap-2">
				{SUGGESTIONS.map((s) => (
					<button
						key={s.text}
						type="button"
						onClick={() => onAsk(s.text)}
						className={`rounded-full px-4 py-2 text-sm font-medium text-heading transition duration-200 hover:-translate-y-0.5 hover:shadow-soft ${s.color}`}
					>
						{s.text}
					</button>
				))}
			</div>
			<form
				onSubmit={onSubmit}
				className="flex w-full items-center rounded-full border border-line bg-white p-1.5 pl-5 shadow-soft transition focus-within:border-indigo-300"
			>
				<input
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					placeholder="Or type a question…"
					className="h-10 flex-1 bg-transparent text-heading outline-none placeholder:text-caption"
				/>
				<button
					type="submit"
					aria-label="Ask"
					disabled={!draft.trim()}
					className="flex size-10 items-center justify-center rounded-full bg-indigo-500 text-white transition hover:bg-indigo-700 disabled:bg-indigo-100"
				>
					<ArrowUpIcon />
				</button>
			</form>
		</div>
	);
}
