import { describe, expect, it } from "vitest";
import { computeEnergy, energyLevel } from "#/lib/energy";
import {
	DEFAULT_TODAY,
	mockHealth,
	PRESETS,
	parseToday,
	withToday,
} from "./mock-health";

describe("parseToday", () => {
	it("falls back to the demo story", () => {
		expect(parseToday(undefined)).toEqual(DEFAULT_TODAY);
		expect(parseToday({ sleepHours: "abc" })).toEqual(DEFAULT_TODAY);
	});

	it("clamps and rounds untrusted values", () => {
		expect(parseToday({ sleepHours: 42, hrvMs: -5, restingHr: 61.6 })).toEqual({
			sleepHours: 10,
			hrvMs: 15,
			restingHr: 62,
		});
		expect(parseToday({ sleepHours: 6.04 }).sleepHours).toBe(6);
	});
});

describe("withToday", () => {
	it("only replaces the last day", () => {
		const days = withToday(mockHealth, PRESETS[1].today);
		expect(days).toHaveLength(mockHealth.length);
		expect(days.slice(0, -1)).toEqual(mockHealth.slice(0, -1));
		expect(days.at(-1)).toMatchObject(PRESETS[1].today);
		expect(days.at(-1)?.steps).toBe(mockHealth.at(-1)?.steps);
	});
});

describe("presets", () => {
	it("cover each Body Battery level", () => {
		const levels = PRESETS.map(({ today }) =>
			energyLevel(computeEnergy(withToday(mockHealth, today)).score),
		);
		expect(levels).toEqual(["Moderate", "Good", "Low"]);
	});

	it("opens on a well-rested day", () => {
		expect(DEFAULT_TODAY).toEqual({
			sleepHours: 8.2,
			hrvMs: 58,
			restingHr: 53,
		});
	});
});
