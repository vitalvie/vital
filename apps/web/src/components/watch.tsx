import { useEffect, useState } from "react";
import { useCountUp } from "#/lib/count-up";
import { type EnergyLevel, energyLevel } from "#/lib/energy";
import type { Mic } from "#/lib/notice";
import { CloseIcon } from "./icons";
import { Orb, type Status } from "./orb";

const STATUS_LABEL: Record<Status, string> = {
	idle: "Tap to talk",
	listening: "Listening… tap to send",
	thinking: "Thinking…",
	speaking: "Speaking…",
};

const MIC_LABEL: Record<Mic, string> = {
	ready: STATUS_LABEL.idle,
	insecure: "Mic needs HTTPS",
	unsupported: "Type to ask",
	blocked: "Mic is off. Tap to retry",
};

const DOT: Record<EnergyLevel, string> = {
	Low: "bg-bad",
	Moderate: "bg-warn",
	Good: "bg-good",
};

type Props = {
	status: Status;
	level?: () => number;
	battery: number;
	mic: Mic;
	// The last exchange. The answer is read on the screen while the orb steps aside.
	question?: string;
	answer?: string;
	// Zoom classes for the place the watch sits in.
	className?: string;
	onOrb: () => void;
	onCancel: () => void;
};

// Apple Watch Ultra-style device frame with the voice UI on its screen.
// Drawn at full size, then zoomed down on small screens so layout follows.
export function Watch({
	status,
	level,
	battery,
	mic,
	question = "",
	answer = "",
	className = "[zoom:0.72] min-[400px]:[zoom:0.8] sm:[zoom:1]",
	onOrb,
	onCancel,
}: Props) {
	const time = useClock();
	const shown = Math.round(useCountUp(battery));
	const cancellable = status === "listening" || status === "speaking";
	const reading = !!answer && (status === "speaking" || status === "idle");
	const label =
		status === "thinking" && question
			? `“${question}”`
			: status === "idle"
				? MIC_LABEL[mic]
				: STATUS_LABEL[status];
	// At rest the orb is centered. It slides up for the cancel row, or shrinks to the bottom while the answer is read.
	const orbPlace = reading
		? "translate-y-[154px] scale-[0.45]"
		: cancellable
			? "-translate-y-7"
			: "";

	return (
		<div className={`flex flex-col items-center ${className}`}>
			<Band />
			<div className="relative">
				<div className="rounded-[80px] bg-linear-to-br from-titanium-light to-titanium p-4 shadow-device">
					<div className="rounded-[66px] bg-screen p-3">
						<div className="relative flex h-[400px] w-[340px] flex-col items-center justify-center rounded-[56px] bg-screen text-white">
							<div className="absolute inset-x-8 top-8 flex items-center justify-between text-base">
								<span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 font-medium tabular-nums">
									<span
										className={`size-2 rounded-full transition-colors duration-500 ${DOT[energyLevel(battery)]}`}
										aria-hidden="true"
									/>
									<span className="sr-only">Body Battery </span>
									{shown}%
								</span>
								<time className="font-medium tabular-nums">{time}</time>
							</div>

							<p
								aria-hidden="true"
								className={`absolute inset-x-8 top-[72px] h-[228px] overflow-y-auto [mask-image:linear-gradient(to_bottom,black_82%,transparent)] pb-8 text-[22px] leading-7 font-medium text-pretty transition duration-500 ease-smooth ${
									reading
										? "opacity-100"
										: "pointer-events-none translate-y-2 opacity-0"
								}`}
							>
								{answer}
							</p>

							<div
								className={`flex flex-col items-center gap-4 transition duration-500 ease-smooth ${orbPlace}`}
							>
								<Orb
									status={status}
									level={level}
									muted={mic === "insecure" || mic === "unsupported"}
									className="size-40"
									onClick={onOrb}
								/>
								<p
									aria-hidden="true"
									className={`line-clamp-2 max-w-[260px] text-center text-lg font-medium transition-opacity duration-300 ${reading ? "opacity-0" : ""}`}
								>
									{label}
								</p>
							</div>

							<div className="pointer-events-none absolute inset-x-8 bottom-6 flex h-[68px] items-center justify-between *:pointer-events-auto">
								<LevelBars active={status === "listening"} />
								<button
									type="button"
									onClick={onCancel}
									aria-label={
										status === "speaking"
											? "Stop speaking"
											: "Discard the recording"
									}
									className={`flex size-[68px] items-center justify-center rounded-full bg-bad transition duration-300 ease-smooth focus-visible:outline-white active:scale-95 ${
										cancellable ? "scale-100 opacity-100" : "scale-75 opacity-0"
									}`}
									disabled={!cancellable}
								>
									<CloseIcon size={24} />
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="absolute top-28 -right-3 h-20 w-5 rounded-r-xl bg-linear-to-b from-titanium-light to-titanium" />
				<div className="absolute top-56 -right-2 h-16 w-2.5 rounded-r-md bg-titanium" />
				<div className="absolute top-32 -left-2 h-20 w-2.5 rounded-l-md bg-band" />
			</div>
			<Band />
		</div>
	);
}

function Band() {
	return (
		<div className="watch-band h-12 w-[240px] first:rounded-t-2xl last:rounded-b-2xl sm:h-20" />
	);
}

function LevelBars({ active }: { active: boolean }) {
	return (
		<div
			aria-hidden="true"
			className={`flex h-6 items-center gap-1.5 pl-1 transition-opacity duration-300 ease-smooth ${active ? "opacity-100" : "opacity-0"}`}
		>
			{[0, 1, 2, 3, 4].map((i) => (
				<span
					key={i}
					className={`h-full w-1.5 rounded-full bg-white ${active ? "level-bar" : "scale-y-35"}`}
					style={{ animationDelay: `${i * 120}ms` }}
				/>
			))}
		</div>
	);
}

function useClock() {
	const [time, setTime] = useState("");
	useEffect(() => {
		const tick = () =>
			setTime(
				new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
			);
		tick();
		const id = setInterval(tick, 10_000);
		return () => clearInterval(id);
	}, []);
	return time;
}
