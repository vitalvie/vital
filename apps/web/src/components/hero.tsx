import type { Energy } from "#/lib/energy";
import { SHOWCASE_QUESTION, showcaseLevel, useShowcase } from "#/lib/showcase";
import { BatteryPreview } from "./battery-preview";
import { ArrowDownIcon, MicIcon } from "./icons";
import { SignalSources } from "./signal-sources";
import { Watch } from "./watch";

const noop = () => {};

// The hero sells: headline, one call to action, and the watch on show.
// The watch here plays a scripted exchange. The real one is in the demo, one click below.
export function Hero({ energy }: { energy: Energy }) {
	const show = useShowcase();

	return (
		<section
			aria-labelledby="hero-title"
			className="shell grid items-center gap-x-10 gap-y-10 overflow-x-clip pt-8 pb-section sm:pt-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:pt-14"
		>
			<div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
				<p className="eyebrow animate-fade-up">
					<span
						className="size-2 rounded-full bg-indigo-500"
						aria-hidden="true"
					/>
					A voice companion for everyday energy
				</p>
				<h1 id="hero-title" className="text-display text-heading">
					<span className="block text-balance xl:whitespace-nowrap">
						Ask your body —
					</span>
					<span className="block text-indigo-500">anything</span>
				</h1>
				<p className="animate-fade-up max-w-[38ch] text-lead text-pretty [animation-delay:80ms]">
					Sleep, heart and activity already live on your wrist. Ask out loud how
					you're doing, and Vital answers in two or three short sentences.
				</p>
				<div className="animate-fade-up flex flex-wrap justify-center gap-3 [animation-delay:160ms] lg:justify-start">
					<a
						href="#demo"
						className="btn btn-primary min-h-12 sm:min-h-14 sm:px-7 sm:text-lg"
					>
						Try the demo
						<ArrowDownIcon />
					</a>
					<a
						href="#how"
						className="btn btn-light min-h-12 sm:min-h-14 sm:px-7 sm:text-lg"
					>
						How it works
					</a>
				</div>
				<p className="animate-fade-up text-sm leading-5 text-caption [animation-delay:240ms]">
					Open source. Sample data shaped like Apple Health. Not a medical
					device.
				</p>
			</div>

			<div className="group relative">
				<div className="rounded-5xl bg-linear-to-br from-indigo-100 via-indigo-50 to-pink-50 px-4 pt-10 pb-6 sm:px-12 sm:pt-14 sm:pb-12">
					<div
						aria-hidden="true"
						inert
						className="animate-pop-in flex justify-center"
					>
						<div className="animate-float">
							<div className="hero-tilt">
								<Watch
									status={show.status}
									level={
										show.status === "listening" ? showcaseLevel : undefined
									}
									battery={energy.score}
									mic="ready"
									question={show.question}
									answer={show.answer}
									className="[zoom:0.72] min-[400px]:[zoom:0.8] sm:[zoom:1] lg:[zoom:0.9] xl:[zoom:1]"
									onOrb={noop}
								/>
							</div>
						</div>
					</div>
					<SignalSources />
					<p
						aria-hidden="true"
						className="animate-fade-up absolute top-8 -left-6 hidden items-center gap-2 rounded-full bg-white py-2 pr-4 pl-2 text-sm font-medium text-heading shadow-lift [animation-delay:500ms] lg:flex"
					>
						<span className="flex size-8 items-center justify-center rounded-full bg-indigo-500 text-white">
							<MicIcon size={16} />
						</span>
						“{SHOWCASE_QUESTION}”
					</p>
				</div>
				{/* The whole stage leads to the demo, for people who tap the watch. */}
				<a href="#demo" className="absolute inset-0 z-10 rounded-5xl">
					<span className="sr-only">See the watch in the live demo</span>
				</a>
				<BatteryPreview
					energy={energy}
					className="relative z-20 mx-4 -mt-2 mb-0 max-w-sm sm:mx-auto lg:absolute lg:-bottom-6 lg:-left-20 lg:mx-0 lg:mt-0 lg:w-60"
				/>
			</div>
		</section>
	);
}
