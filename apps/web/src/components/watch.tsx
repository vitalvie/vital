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
	onOrb: () => void;
	onCancel: () => void;
};

// Apple Watch Ultra-style device frame with the voice UI on its screen.
// Drawn at full size, then zoomed down on small screens so layout follows.
export function Watch({ status, level, battery, mic, onOrb, onCancel }: Props) {
	const time = useClock();
	const shown = Math.round(useCountUp(battery));
	const cancellable = status === "listening" || status === "speaking";

	return (
		<div className="flex flex-col items-center [zoom:0.72] min-[400px]:[zoom:0.8] sm:[zoom:1]">
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

							{/* Centered at rest; slides up to make room for the cancel row. */}
							<div
								className={`flex flex-col items-center gap-4 transition-transform duration-500 ease-smooth ${cancellable ? "-translate-y-7" : ""}`}
							>
								<Orb
									status={status}
									level={level}
									muted={mic === "insecure" || mic === "unsupported"}
									className="size-40"
									onClick={onOrb}
								/>
								<p className="text-lg font-medium" aria-hidden="true">
									{status === "idle" ? MIC_LABEL[mic] : STATUS_LABEL[status]}
								</p>
							</div>

							<div className="absolute inset-x-8 bottom-6 flex h-16 items-center justify-between">
								<LevelBars active={status === "listening"} />
								<button
									type="button"
									onClick={onCancel}
									aria-label={
										status === "speaking"
											? "Stop speaking"
											: "Discard the recording"
									}
									className={`flex size-16 items-center justify-center rounded-full bg-bad transition duration-300 ease-smooth focus-visible:outline-white active:scale-95 ${
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
