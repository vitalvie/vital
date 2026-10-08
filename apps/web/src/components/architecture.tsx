import type { ReactNode } from "react";
import { GraphIcon, MicIcon, SparkIcon, SpeakerIcon, TextIcon } from "./icons";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const STAGES: { icon: ReactNode; name: string; role: string }[] = [
	{ icon: <MicIcon />, name: "Your voice", role: "Recorded in the browser" },
	{ icon: <TextIcon />, name: "Voxtral", role: "Speech to text" },
	{
		icon: <GraphIcon />,
		name: "LangGraph agent",
		role: "Calls one tool: sleep or energy",
	},
	{
		icon: <SparkIcon />,
		name: "Mistral",
		role: "Writes a short, grounded answer",
	},
	{ icon: <SpeakerIcon />, name: "Voxtral", role: "Text to speech" },
];

const STACK = [
	"TanStack Start on Cloudflare Workers",
	"FastAPI and Pydantic",
	"OpenRouter",
	"Live evals in CI",
];

// The voice pipeline as a diagram: five stages, with a dot travelling between them.
export function Architecture() {
	return (
		<section
			id="stack"
			aria-labelledby="stack-title"
			className="shell scroll-mt-24 py-section max-sm:px-2"
		>
			<div className="rounded-5xl bg-night px-5 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
				<Reveal>
					<SectionHeading
						id="stack-title"
						tone="dark"
						eyebrow="Under the hood"
						title="From your voice to an answer."
						lead="One question makes one trip through the pipeline. The model key never leaves the API."
					/>
				</Reveal>
				<Reveal delay={120}>
					<ol className="mt-12 flex flex-col lg:mt-16 lg:flex-row">
						{STAGES.map((s, i) => (
							<li
								key={`${s.name}-${s.role}`}
								className="relative flex flex-1 basis-0 flex-col pt-6 first:pt-0 lg:flex-row lg:pt-0 lg:pl-6 lg:first:pl-0"
							>
								{i > 0 && <Link index={i} />}
								<div className="flex flex-1 items-center gap-4 rounded-3xl bg-night-soft p-4 text-white lg:flex-col lg:items-start lg:p-5">
									<span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-500">
										{s.icon}
									</span>
									<div>
										<h3 className="text-lg leading-6 font-medium">{s.name}</h3>
										<p className="mt-1 text-sm leading-5 text-indigo-100">
											{s.role}
										</p>
									</div>
								</div>
							</li>
						))}
					</ol>
				</Reveal>
				<ul className="mt-8 flex flex-wrap justify-center gap-2">
					{STACK.map((item) => (
						<li
							key={item}
							className="rounded-full bg-night-soft px-3.5 py-1.5 text-sm text-indigo-100"
						>
							{item}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

// The track leading into a stage, drawn in its gutter so every card keeps the same width.
// Vertical in a column, horizontal in a row.
function Link({ index }: { index: number }) {
	return (
		<span
			aria-hidden="true"
			className="absolute top-0 left-1/2 h-6 w-0.5 rounded-full bg-night-soft lg:top-11 lg:left-0 lg:h-0.5 lg:w-6"
		>
			<span
				className="animate-travel absolute -top-1 -left-[3px] size-2 rounded-full bg-teal-300 [--travel-to-y:1.5rem] lg:-top-[3px] lg:-left-1 lg:[--travel-to-x:1.5rem] lg:[--travel-to-y:0]"
				style={{ animationDelay: `${index * 400}ms` }}
			/>
		</span>
	);
}
