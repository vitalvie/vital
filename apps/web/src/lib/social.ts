export const SITE_ORIGIN = "https://vital.vitalvie.workers.dev";

export const SOCIAL_TITLE = "Vital — Talk to your body";

export const SOCIAL_DESCRIPTION =
	"Ask out loud and get a short answer from sample health data. A voice companion for everyday energy, not a doctor.";

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
			content: "Vital: tap the watch to talk, with the answer on the right",
		},
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: SOCIAL_TITLE },
		{ name: "twitter:description", content: SOCIAL_DESCRIPTION },
		{ name: "twitter:image", content: image },
	];
}
