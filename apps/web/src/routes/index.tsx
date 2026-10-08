import { createFileRoute } from "@tanstack/react-router";
import { Architecture } from "#/components/architecture";
import { Benefits } from "#/components/benefits";
import { DemoSection } from "#/components/demo-section";
import { FinalCta } from "#/components/final-cta";
import { Hero } from "#/components/hero";
import { HowItWorks } from "#/components/how-it-works";
import { OpenSource } from "#/components/open-source";
import { Safety } from "#/components/safety";
import { SiteFooter } from "#/components/site-footer";
import { SiteNav } from "#/components/site-nav";
import { useVital } from "#/lib/use-vital";
import { getRelease } from "#/server/release";

export const Route = createFileRoute("/")({
	loader: () => getRelease(),
	component: Home,
});

// The landing page. Sections read top to bottom. The hero sells; the demo below it is the live product.
function Home() {
	const release = Route.useLoaderData();
	const vital = useVital();

	return (
		<div id="top" className="flex min-h-dvh flex-col">
			<a
				href="#demo"
				className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
			>
				Skip to the demo
			</a>
			<SiteNav release={release} />
			<main>
				<Hero energy={vital.energy} />
				<DemoSection vital={vital} />
				<HowItWorks />
				<Benefits />
				<Safety />
				<Architecture />
				<OpenSource release={release} />
				<FinalCta />
			</main>
			<SiteFooter />
		</div>
	);
}
