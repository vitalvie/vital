import type { Notice } from "#/lib/notice";

const ACTION_LABEL = {
	retry: "Try again",
	type: "Type instead",
	secure: "Open secure link",
};

type Props = {
	notice: Notice;
	// Only one copy on the page announces itself to screen readers.
	live?: boolean;
	onRetry: () => void;
	onType: () => void;
};

// Explains why Vital can't listen or answer, with at most one next step.
export function NoticeCard({ notice, live, onRetry, onType }: Props) {
	return (
		<div
			role={live ? "alert" : undefined}
			className="animate-fade-up flex flex-col items-start gap-3 rounded-2xl bg-peach p-4 text-left"
		>
			<div>
				<p className="font-medium text-heading">{notice.title}</p>
				<p className="mt-1 text-sm leading-5 text-pretty">{notice.hint}</p>
			</div>
			{notice.action === "secure" ? (
				<a href={secureUrl()} className="chip bg-white shadow-soft">
					{ACTION_LABEL.secure}
				</a>
			) : (
				notice.action && (
					<button
						type="button"
						onClick={notice.action === "retry" ? onRetry : onType}
						className="chip bg-white shadow-soft hover:bg-indigo-50"
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
