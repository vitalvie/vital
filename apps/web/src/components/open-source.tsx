import { REPO_URL, type ReleaseStatus } from "#/lib/release";
import { ArrowRightIcon, GithubIcon } from "./icons";
import { ReleaseFooter } from "./release-footer";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const HACKATHON_URL = "https://luma.com/t7rspaka";

// The proof is public: licence, code, current release and CI status.
export function OpenSource({ release }: { release: ReleaseStatus }) {
	return (
		<section
			id="open-source"
			aria-labelledby="open-source-title"
			className="shell scroll-mt-24 max-sm:px-2"
		>
			<Reveal>
				<div className="flex flex-col items-start gap-8 rounded-5xl bg-peach px-5 py-12 sm:px-10 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:px-16">
					<SectionHeading
						id="open-source-title"
						align="left"
						eyebrow="Open source"
						title="Read every line."
						lead={
							<>
								Vital is released under AGPL-3.0: the app, prompt system,
								guardrails and evals. Built at the{" "}
								<a
									href={HACKATHON_URL}
									className="font-medium text-heading underline underline-offset-4 hover:text-indigo-700"
								>
									Alan × Mistral AI hackathon
								</a>
								, Paris, 11 April 2026.
							</>
						}
					/>
					<div className="flex flex-col items-start gap-4 lg:items-end">
						<a href={REPO_URL} className="btn btn-primary">
							<GithubIcon size={18} />
							View on GitHub
							<ArrowRightIcon />
						</a>
						<ReleaseFooter release={release} />
					</div>
				</div>
			</Reveal>
		</section>
	);
}
