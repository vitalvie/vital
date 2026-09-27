import { useEffect, useRef } from "react";
import { MicIcon, StopIcon } from "./icons";

export type Status = "idle" | "listening" | "thinking" | "speaking";

type Props = {
	status: Status;
	level?: () => number;
	disabled?: boolean;
	className?: string;
	onClick: () => void;
};

// The voice orb is the main control: tap to talk, tap to send, tap to stop.
export function Orb({
	status,
	level,
	disabled,
	className = "size-32",
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

	const busy = status === "listening" || status === "speaking";

	return (
		<button
			ref={ref}
			type="button"
			data-status={status}
			onClick={onClick}
			disabled={disabled}
			aria-label={busy ? "Stop" : "Ask Vital"}
			className={`orb relative rounded-full text-white outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 disabled:opacity-40 ${className}`}
		>
			<span className="orb-glow" />
			<span className="orb-core" />
			<span className="relative flex items-center justify-center">
				{busy ? <StopIcon size={22} /> : <MicIcon size={26} />}
			</span>
		</button>
	);
}
