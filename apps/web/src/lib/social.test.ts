import { describe, expect, it } from "vitest";
import { SITE_ORIGIN, socialMeta } from "./social";

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
