export const SITE_ORIGIN = "https://vital.vitalvie.workers.dev";

export const SOCIAL_TITLE = "Vital — Ask your body anything";

// Browser chrome color. Matches the `cream` token in styles.css.
export const THEME_COLOR = "#fffcf5";

export const SOCIAL_DESCRIPTION =
	"Ask out loud how you're doing and hear a short answer grounded in sample sleep and heart data. An open-source voice companion for everyday energy, not a doctor.";

export function socialMeta(origin: string) {
	const base = origin.replace(/\/$/, "");
	const image = `${base}/og.png`;
	return [
		{ name: "description", content: SOCIAL_DESCRIPTION },
		{ property: "og:type", content: "website" },
		{ property: "og:site_name", content: "Vital" },
		{ property: "og:title", content: SOCIAL_TITLE },
		{ property: "og:description", content: SOCIAL_DESCRIPTION },
		{ property: "og:url", content: `${base}/` },
		{ property: "og:image", content: image },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		{
			property: "og:image:alt",
			content:
				"Vital landing page: the headline Ask your body, anything, next to a watch with a glowing orb that says Tap to talk",
		},
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: SOCIAL_TITLE },
		{ name: "twitter:description", content: SOCIAL_DESCRIPTION },
		{ name: "twitter:image", content: image },
	];
}

// schema.org description of the page, for search engines.
export function structuredData(origin: string) {
	const base = origin.replace(/\/$/, "");
	return {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: "Vital",
		url: `${base}/`,
		description: SOCIAL_DESCRIPTION,
		applicationCategory: "HealthApplication",
		operatingSystem: "Any",
		isAccessibleForFree: true,
		license: "https://www.gnu.org/licenses/agpl-3.0.html",
		image: `${base}/og.png`,
		offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
	};
}
