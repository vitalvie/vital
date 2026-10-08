import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import {
	SITE_ORIGIN,
	SOCIAL_TITLE,
	socialMeta,
	THEME_COLOR,
} from "#/lib/social";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover",
			},
			{ name: "theme-color", content: THEME_COLOR },
			{ name: "color-scheme", content: "light" },
			{ title: SOCIAL_TITLE },
			...socialMeta(SITE_ORIGIN),
		],
		links: [
			{
				rel: "preload",
				href: "/fonts/alan-sans-latin.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous",
			},
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
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
