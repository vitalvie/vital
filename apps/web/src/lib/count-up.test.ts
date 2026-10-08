import { describe, expect, it } from "vitest";
import { tween } from "./count-up";

describe("tween", () => {
	it("starts and lands exactly on its ends", () => {
		expect(tween(35, 95, 0)).toBe(35);
		expect(tween(35, 95, 1)).toBe(95);
	});

	it("eases out: most of the distance is covered early", () => {
		expect(tween(0, 100, 0.5)).toBe(87.5);
	});

	it("counts down as well as up", () => {
		expect(tween(95, 35, 0.5)).toBe(42.5);
	});

	it("never overshoots when the clock runs past the end", () => {
		expect(tween(0, 100, 1.4)).toBe(100);
		expect(tween(0, 100, -1)).toBe(0);
	});
});
