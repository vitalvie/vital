import { describe, expect, it } from "vitest";
import { type DailyHealth, mockHealth } from "#/data/mock-health";
import {
	type Contributor,
	computeEnergy,
	energyLevel,
	energySummary,
} from "./energy";

const usual: DailyHealth = {
	date: "2026-01-01",
	sleepHours: 7.5,
	hrvMs: 50,
	restingHr: 56,
	steps: 8000,
	activeEnergyKcal: 450,
};

const week = (today: Partial<DailyHealth>) => [
	...Array.from({ length: 6 }, () => usual),
	{ ...usual, ...today },
];

const impacts = (days: DailyHealth[]) =>
	computeEnergy(days).contributors.map((c) => c.impact);

describe("computeEnergy", () => {
	it("scores 75 on a usual day", () => {
		expect(computeEnergy(week({})).score).toBe(75);
		expect(impacts(week({}))).toEqual([0, 0, 0]);
	});

	it("rewards better recovery and penalizes worse", () => {
		expect(
			impacts(week({ sleepHours: 8.5, hrvMs: 60, restingHr: 54 })),
		).toEqual([6, 10, 4]);
		expect(
			impacts(week({ sleepHours: 6.5, hrvMs: 40, restingHr: 58 })),
		).toEqual([-6, -10, -4]);
	});

	it("caps each contributor and keeps the score between 0 and 100", () => {
		const worst = computeEnergy(
			week({ sleepHours: 0, hrvMs: 1, restingHr: 99 }),
		);
		expect(worst.contributors.map((c) => c.impact)).toEqual([-20, -20, -15]);
		expect(worst.score).toBe(20);

		const best = computeEnergy(
			week({ sleepHours: 12, hrvMs: 200, restingHr: 30 }),
		);
		expect(best.contributors.map((c) => c.impact)).toEqual([15, 15, 10]);
		expect(best.score).toBe(100);
	});

	it("uses the days before today as the baseline", () => {
		const { contributors, today, yesterday } = computeEnergy(
			week({ sleepHours: 5 }),
		);
		expect(contributors[0].baseline).toBe(7.5);
		expect(today.sleepHours).toBe(5);
		expect(yesterday).toBe(usual);
	});

	it("tells the demo story: low battery after a short night", () => {
		const { score, contributors } = computeEnergy(mockHealth);
		expect(score).toBe(35);
		expect(contributors.every((c) => c.impact < 0)).toBe(true);
	});
});

describe("energyLevel", () => {
	it("maps the score to a level", () => {
		expect(energyLevel(0)).toBe("Low");
		expect(energyLevel(29)).toBe("Low");
		expect(energyLevel(30)).toBe("Moderate");
		expect(energyLevel(59)).toBe("Moderate");
		expect(energyLevel(60)).toBe("Good");
		expect(energyLevel(100)).toBe("Good");
	});
});

describe("energySummary", () => {
	const c = (label: string, impact: number): Contributor => ({
		label,
		impact,
		today: 0,
		baseline: 0,
		unit: "",
	});

	it("names the two biggest drains and keeps acronyms", () => {
		expect(
			energySummary([c("Sleep", -13), c("HRV", -15), c("Resting HR", -2)]),
		).toBe("Your HRV and sleep are pulling you down today.");
	});

	it("lowercases a single drain", () => {
		expect(energySummary([c("Resting HR", -4), c("Sleep", 3)])).toBe(
			"Your resting HR is pulling you down today.",
		);
	});

	it("is positive when nothing drains", () => {
		expect(energySummary([c("Sleep", 2), c("HRV", 0)])).toBe(
			"You're recovered and ready to go.",
		);
	});
});
