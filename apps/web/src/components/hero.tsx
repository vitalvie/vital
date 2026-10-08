import { focusAskInput, type Vital } from "#/lib/use-vital";
import { SUGGESTIONS } from "./ask-bar";
import { BatteryPreview } from "./battery-preview";
import { NoticeCard } from "./notice-card";
import { Watch } from "./watch";

// The product is the hero: a working watch, three questions to try, and today's score.
export function Hero({ vital }: { vital: Vital }) {
	const busy = vital.status !== "idle";

	return (
		<section
			aria-labelledby="hero-title"
			className="shell grid gap-x-16 gap-y-8 pt-8 pb-section sm:pt-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:pt-16"
		>
			<div className="flex flex-col items-center gap-5 text-center lg:items-start lg:self-end lg:text-left">
				<p className="eyebrow animate-fade-up">
					<span
						className="size-2 rounded-full bg-indigo-500"
						aria-hidden="true"
					/>
					A voice companion for everyday energy
				</p>
				<h1 id="hero-title" className="text-display text-balance text-heading">
					Talk to your body.
				</h1>
				<p className="animate-fade-up max-w-[36ch] text-lead text-pretty [animation-delay:80ms]">
					Ask out loud how you're doing today. Vital answers in two or three
					short sentences, grounded in your own sleep and heart numbers.
				</p>
			</div>

			<div
				id="try"
				className="animate-fade-up relative scroll-mt-24 [animation-delay:160ms] lg:col-start-2 lg:row-span-2 lg:row-start-1"
			>
				<div className="flex flex-col items-center rounded-5xl bg-linear-to-br from-indigo-100 via-indigo-50 to-pink-50 px-4 py-6 sm:p-10 lg:px-14">
					<Watch
						status={vital.status}
						level={vital.level}
						battery={vital.energy.score}
						mic={vital.mic}
						question={vital.question}
						answer={vital.answer}
						className="[zoom:0.72] min-[400px]:[zoom:0.8] sm:[zoom:1] lg:[zoom:0.86] xl:[zoom:1]"
						onOrb={vital.onOrb}
						onCancel={vital.onCancel}
					/>
					<BatteryPreview
						energy={vital.energy}
						className="mt-5 w-full max-w-sm lg:absolute lg:bottom-8 lg:-left-28 lg:mt-0 lg:w-60"
					/>
				</div>
			</div>

			<div className="animate-fade-up flex flex-col items-center gap-3 [animation-delay:240ms] lg:items-start lg:self-start">
				<p className="text-sm font-medium text-caption">
					Tap the watch, or try a question
				</p>
				<ul className="flex flex-wrap justify-center gap-2 lg:justify-start">
					{SUGGESTIONS.map((s) => (
						<li key={s.text}>
							<button
								type="button"
								disabled={busy}
								onClick={() => vital.ask(s.text)}
								className={`chip hover:shadow-soft ${s.color}`}
							>
								{s.text}
							</button>
						</li>
					))}
				</ul>
				{vital.notice && (
					<div className="w-full max-w-md">
						<NoticeCard
							notice={vital.notice}
							onRetry={vital.retry}
							onType={focusAskInput}
						/>
					</div>
				)}
				<p className="mt-1 text-xs leading-5 text-caption">
					Runs on sample data. Not a medical device.
				</p>
			</div>
		</section>
	);
}
