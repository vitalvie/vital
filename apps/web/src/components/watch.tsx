import { useEffect, useState } from "react";
import { CloseIcon } from "./icons";
import { Orb, type Status } from "./orb";

const STATUS_LABEL: Record<Status, string> = {
	idle: "Tap to talk",
	listening: "Listening…",
	thinking: "Thinking…",
	speaking: "Speaking…",
};

type Props = {
	status: Status;
	level?: () => number;
	battery: number;
	voice: boolean;
	onOrb: () => void;
	onCancel: () => void;
};

// Apple Watch Ultra-style device frame with the voice UI on its screen.
export function Watch({
	status,
	level,
	battery,
	voice,
	onOrb,
	onCancel,
}: Props) {
	const time = useClock();
	const cancellable = status === "listening" || status === "speaking";

	return (
		<div className="flex origin-top flex-col items-center max-sm:-mb-24 max-sm:scale-[0.8]">
			<Band />
			<div className="relative">
				<div className="rounded-[80px] bg-linear-to-br from-titanium-light to-titanium p-4 shadow-[0_30px_60px_rgba(40,40,48,0.25)]">
					<div className="rounded-[66px] bg-screen p-3">
						<div className="relative flex h-[400px] w-[340px] flex-col items-center justify-between rounded-[56px] bg-screen px-8 py-8 text-white">
							<div className="flex w-full items-center justify-between text-base">
								<span className="rounded-full bg-white/10 px-2 py-0.5 font-medium text-warn">
									{battery}%
								</span>
								<span className="font-medium tabular-nums">{time}</span>
							</div>

							<Orb
								status={status}
								level={level}
								disabled={!voice && status === "idle"}
								className="size-40"
								onClick={onOrb}
							/>

							<p className="text-lg font-medium">
								{voice || status !== "idle"
									? STATUS_LABEL[status]
									: "Mic needs HTTPS"}
							</p>

							<div className="flex h-12 w-full items-center justify-between">
								<LevelDots active={status === "listening"} />
								<button
									type="button"
									onClick={onCancel}
									aria-label="Cancel"
									className={`flex size-12 items-center justify-center rounded-full bg-bad transition duration-300 ${
										cancellable ? "scale-100 opacity-100" : "scale-75 opacity-0"
									}`}
									disabled={!cancellable}
								>
									<CloseIcon />
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
		<div className="h-20 w-[240px] bg-band bg-[repeating-linear-gradient(0deg,transparent_0_6px,rgba(0,0,0,0.06)_6px_8px)] first:rounded-t-2xl last:rounded-b-2xl" />
	);
}

function LevelDots({ active }: { active: boolean }) {
	return (
		<div className="flex items-center gap-1.5 pl-1">
			{[0, 1, 2, 3, 4].map((i) => (
				<span
					key={i}
					className={`size-2.5 rounded-full bg-white ${active ? "animate-bounce" : "opacity-30"}`}
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
