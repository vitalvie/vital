import { ArrowRightIcon } from "./icons";
import { Reveal } from "./reveal";

// Last call: back to the demo.
export function FinalCta() {
	return (
		<section
			aria-labelledby="cta-title"
			className="shell py-section max-sm:px-2"
		>
			<Reveal>
				<div className="flex flex-col items-center gap-6 rounded-5xl bg-indigo-500 px-5 py-16 text-center sm:py-24">
					<h2
						id="cta-title"
						className="max-w-3xl text-display text-balance text-white"
					>
						Go on, ask it something.
					</h2>
					<p className="max-w-md text-lead text-pretty text-white">
						One tap on the watch, no sign-up. It runs on sample data.
					</p>
					<a href="#demo" className="btn btn-light min-h-14 px-7 text-lg">
						Talk to Vital
						<ArrowRightIcon />
					</a>
				</div>
			</Reveal>
		</section>
	);
}
