import { describe, expect, it } from "vitest";
import {
	SHOWCASE_ANSWER,
	SHOWCASE_LENGTH,
	SHOWCASE_QUESTION,
	SHOWCASE_STILL,
	showcaseFrame,
} from "./showcase";

describe("showcaseFrame", () => {
	it("walks through the four states in order", () => {
		expect([0, 2200, 4600, 5800].map((t) => showcaseFrame(t).status)).toEqual([
			"idle",
			"listening",
			"thinking",
			"speaking",
		]);
	});

	it("shows the question once asked, and the answer only while speaking", () => {
		expect(showcaseFrame(100)).toEqual({
			status: "idle",
			question: "",
			answer: "",
		});
		expect(showcaseFrame(5000).question).toBe(SHOWCASE_QUESTION);
		expect(showcaseFrame(5000).answer).toBe("");
		expect(showcaseFrame(8000).answer).toBe(SHOWCASE_ANSWER);
	});

	it("loops", () => {
		expect(showcaseFrame(SHOWCASE_LENGTH + 2500)).toEqual(showcaseFrame(2500));
		expect(showcaseFrame(SHOWCASE_LENGTH - 1).status).toBe("speaking");
	});
});

describe("showcase copy", () => {
	it("holds the answer when motion is off", () => {
		expect(SHOWCASE_STILL.answer).toBe(SHOWCASE_ANSWER);
		expect(SHOWCASE_STILL.status).toBe("idle");
	});

	it("reads the data without a medical claim or a list of measurements", () => {
		expect(SHOWCASE_ANSWER).not.toMatch(/\d|diagnos|condition|should see/i);
	});
});
