import type { DailyHealth } from "#/data/mock-health";

// Simplified daily Body Battery: today's recovery signals vs the user's own baseline.
// A wellness indicator, not a medical measure.

export type Contributor = {
	label: string;
	today: number;
	baseline: number;
	unit: string;
	impact: number; // points added to or removed from the score
};

export type Energy = {
	score: number;
	contributors: Contributor[];
	today: DailyHealth;
	yesterday: DailyHealth;
};

const clamp = (v: number, min: number, max: number) =>
	Math.min(max, Math.max(min, v));

const round1 = (v: number) => Math.round(v * 10) / 10;

const average = (days: DailyHealth[], key: keyof Omit<DailyHealth, "date">) =>
	days.reduce((sum, d) => sum + d[key], 0) / days.length;

export function computeEnergy(days: DailyHealth[]): Energy {
	const today = days[days.length - 1];
	const yesterday = days[days.length - 2];
	const history = days.slice(0, -1);

	const sleepBase = average(history, "sleepHours");
	const hrvBase = average(history, "hrvMs");
	const rhrBase = average(history, "restingHr");

	const contributors: Contributor[] = [
		{
			label: "Sleep",
			today: today.sleepHours,
			baseline: round1(sleepBase),
			unit: "h",
			impact: clamp((today.sleepHours - sleepBase) * 6, -20, 15),
		},
		{
			label: "HRV",
			today: today.hrvMs,
			baseline: Math.round(hrvBase),
			unit: "ms",
			impact: clamp(((today.hrvMs - hrvBase) / hrvBase) * 50, -20, 15),
		},
		{
			label: "Resting HR",
			today: today.restingHr,
			baseline: Math.round(rhrBase),
			unit: "bpm",
			impact: clamp((rhrBase - today.restingHr) * 2, -15, 10),
		},
	].map((c) => ({ ...c, impact: Math.round(c.impact) }));

	const score = clamp(
		75 + contributors.reduce((sum, c) => sum + c.impact, 0),
		0,
		100,
	);

	return { score, contributors, today, yesterday };
}

export type EnergyLevel = "Low" | "Moderate" | "Good";

export function energyLevel(score: number): EnergyLevel {
	return score < 30 ? "Low" : score < 60 ? "Moderate" : "Good";
}

// One friendly sentence naming the two biggest drains, if any.
export function energySummary(contributors: Contributor[]): string {
	const drains = contributors
		.filter((c) => c.impact < 0)
		.sort((a, b) => a.impact - b.impact)
		.slice(0, 2)
		.map((c) => c.label.replace(/^[A-Z][a-z]/, (m) => m.toLowerCase()));
	return drains.length
		? `Your ${drains.join(" and ")} ${drains.length > 1 ? "are" : "is"} pulling you down today.`
		: "You're recovered and ready to go.";
}
