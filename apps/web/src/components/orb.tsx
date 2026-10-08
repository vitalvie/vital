import { useEffect, useRef } from "react";
import { ArrowUpIcon, MicIcon, MicOffIcon, StopIcon } from "./icons";

export type Status = "idle" | "listening" | "thinking" | "speaking";

const LABEL: Record<Status, string> = {
	idle: "Start talking",
	listening: "Send your question",
	thinking: "Vital is thinking",
	speaking: "Stop speaking",
};

type Props = {
	status: Status;
	level?: () => number;
	// Voice is unavailable: the orb dims and sends people to the text input.
	muted?: boolean;
	className?: string;
	onClick: () => void;
};

// The voice orb is the main control: tap to talk, tap to send, tap to stop.
export function Orb({
	status,
	level,
	muted,
	className = "size-40",
	onClick,
}: Props) {
	const ref = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el || !level) return;
		let frame = 0;
		let smooth = 0;
		const tick = () => {
			smooth += (level() - smooth) * 0.25;
			el.style.setProperty("--level", smooth.toFixed(3));
			frame = requestAnimationFrame(tick);
		};
		tick();
		return () => {
			cancelAnimationFrame(frame);
			el.style.setProperty("--level", "0");
		};
	}, [level]);

	const quiet = muted && status === "idle";

	return (
		<button
			ref={ref}
			type="button"
			data-status={status}
			data-muted={quiet || undefined}
			onClick={onClick}
			aria-disabled={status === "thinking"}
			aria-label={quiet ? "Type your question instead" : LABEL[status]}
			className={`orb relative rounded-full text-white ${className}`}
		>
			<span className="orb-glow" />
			<span className="orb-ring" />
			<span className="orb-core" />
			<span className="relative flex items-center justify-center">
				<OrbIcon status={status} quiet={quiet} />
			</span>
		</button>
	);
}

function OrbIcon({ status, quiet }: { status: Status; quiet?: boolean }) {
	if (quiet) return <MicOffIcon size={32} />;
	if (status === "listening") return <ArrowUpIcon size={32} />;
	if (status === "speaking") return <StopIcon size={28} />;
	if (status === "idle") return <MicIcon size={32} />;
	return (
		<span className="flex gap-1.5">
			{[0, 1, 2].map((i) => (
				<span
					key={i}
					className="size-2 animate-pulse rounded-full bg-white"
					style={{ animationDelay: `${i * 180}ms` }}
				/>
			))}
		</span>
	);
}
