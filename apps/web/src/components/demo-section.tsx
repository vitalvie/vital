import type { Vital } from "#/lib/use-vital";
import { BodyBatteryCard } from "./body-battery-card";
import { Conversation } from "./conversation";
import { Reveal } from "./reveal";
import { ScenarioControl } from "./scenario-control";
import { SectionHeading } from "./section-heading";
import { Watch } from "./watch";

// The whole app in one block: watch, score, conversation, and the sample-day control.
export function DemoSection({ vital }: { vital: Vital }) {
	return (
		<section
			id="demo"
			aria-labelledby="demo-title"
			className="shell scroll-mt-24 max-sm:px-2"
		>
			<div className="rounded-5xl bg-indigo-50 px-3 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
				<Reveal>
					<SectionHeading
						id="demo-title"
						eyebrow="The app in action"
						title="Same question, different day."
						lead="Vital reads today against your usual. Change the sample day and ask again: the answer follows the numbers."
					/>
				</Reveal>
				<div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:mt-14 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-12">
					<div className="flex justify-center lg:sticky lg:top-28 lg:self-start">
						<Watch
							status={vital.status}
							level={vital.level}
							battery={vital.energy.score}
							mic={vital.mic}
							question={vital.question}
							answer={vital.answer}
							className="[zoom:0.72] min-[400px]:[zoom:0.8] sm:[zoom:0.86]"
							onOrb={vital.onOrb}
							onCancel={vital.onCancel}
						/>
					</div>
					<div className="flex min-w-0 flex-col gap-4">
						<ScenarioControl
							days={vital.days}
							today={vital.today}
							onChange={vital.setToday}
						/>
						<BodyBatteryCard energy={vital.energy} />
						<Conversation
							status={vital.status}
							question={vital.question}
							answer={vital.answer}
							notice={vital.notice}
							onAsk={vital.ask}
							onRetry={vital.retry}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
