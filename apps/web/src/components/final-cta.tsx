import { ArrowUpIcon } from "./icons";
import { Reveal } from "./reveal";

// Last call: back up to the watch.
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
						The watch is waiting at the top of the page. It takes one tap.
					</p>
					<a href="#try" className="btn btn-light min-h-14 px-7 text-lg">
						Talk to Vital
						<ArrowUpIcon />
					</a>
				</div>
			</Reveal>
		</section>
	);
}
