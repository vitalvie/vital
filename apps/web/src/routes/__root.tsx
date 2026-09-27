import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { getRequestUrl } from "@tanstack/react-start/server";
import { SITE_ORIGIN, SOCIAL_TITLE, socialMeta } from "#/lib/social";
import appCss from "../styles.css?url";

function pageOrigin() {
	if (typeof window !== "undefined") return window.location.origin;
	try {
		return getRequestUrl({ xForwardedHost: true }).origin;
	} catch {
		return SITE_ORIGIN;
	}
}

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: SOCIAL_TITLE },
			...socialMeta(pageOrigin()),
		],
		links: [
			{ rel: "preconnect", href: "https://fonts.gstatic.com" },
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Alan+Sans:wght@400;500;700&display=swap",
			},
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
