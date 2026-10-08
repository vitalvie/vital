import { REPO_URL } from "#/lib/release";
import { Logo } from "./logo";

const LINKS = [
	{ href: "#how", label: "How it works" },
	{ href: "#safety", label: "Safety" },
	{ href: "#stack", label: "Under the hood" },
	{ href: REPO_URL, label: "GitHub" },
	{ href: `${REPO_URL}/blob/main/LICENSE`, label: "AGPL-3.0" },
];

export function SiteFooter() {
	return (
		<footer className="bg-cream-deep pb-[max(2.5rem,env(safe-area-inset-bottom))]">
			<div className="shell flex flex-col gap-8 pt-12 lg:flex-row lg:items-start lg:justify-between">
				<div className="flex max-w-md flex-col gap-4">
					<Logo className="text-heading" />
					<p className="text-sm leading-6 text-pretty">
						Vital is not a medical device and does not give diagnoses. It runs
						on sample data. For health concerns, talk to a healthcare
						professional.
					</p>
				</div>
				<nav aria-label="Footer">
					<ul className="flex flex-wrap gap-x-2 gap-y-1 lg:justify-end">
						{LINKS.map((l) => (
							<li key={l.href}>
								<a
									href={l.href}
									className="btn btn-ghost -ml-3 px-3 text-sm lg:ml-0"
								>
									{l.label}
								</a>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</footer>
	);
}
