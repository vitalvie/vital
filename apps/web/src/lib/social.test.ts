import { describe, expect, it } from "vitest";
import {
	SITE_ORIGIN,
	SOCIAL_DESCRIPTION,
	socialMeta,
	structuredData,
} from "./social";

describe("socialMeta", () => {
	it("points the preview at an absolute image on the shared origin", () => {
		const meta = socialMeta("https://vital.vitalvie.workers.dev");
		const image = meta.find((tag) => tag.property === "og:image");
		const card = meta.find((tag) => tag.name === "twitter:card");
		expect(image?.content).toBe(`${SITE_ORIGIN}/og.png`);
		expect(card?.content).toBe("summary_large_image");
		expect(meta.find((tag) => tag.property === "og:title")?.content).toMatch(
			/Talk to your body/,
		);
	});
});

describe("structuredData", () => {
	const data = structuredData("https://vital.vitalvie.workers.dev/");

	it("describes a free web application at the canonical URL", () => {
		expect(data["@type"]).toBe("WebApplication");
		expect(data.url).toBe(`${SITE_ORIGIN}/`);
		expect(data.image).toBe(`${SITE_ORIGIN}/og.png`);
		expect(data.isAccessibleForFree).toBe(true);
	});

	it("makes no medical claim", () => {
		expect(JSON.stringify(data)).not.toMatch(
			/diagnos|treat|cure|medical device/i,
		);
		expect(SOCIAL_DESCRIPTION).toMatch(/not a doctor/);
	});
});
