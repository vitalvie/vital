// Synthetic HealthKit-shaped daily data. Oldest first; the last entry is "today".
// Story for the demo: a hard workout yesterday, then a short night.

export type DailyHealth = {
	date: string;
	sleepHours: number; // sleepAnalysis (asleep)
	hrvMs: number; // heartRateVariabilitySDNN, overnight average
	restingHr: number; // restingHeartRate, bpm
	steps: number; // stepCount
	activeEnergyKcal: number; // activeEnergyBurned
};

const samples: Omit<DailyHealth, "date">[] = [
	{
		sleepHours: 7.6,
		hrvMs: 49,
		restingHr: 56,
		steps: 8400,
		activeEnergyKcal: 480,
	},
	{
		sleepHours: 7.2,
		hrvMs: 47,
		restingHr: 57,
		steps: 9100,
		activeEnergyKcal: 520,
	},
	{
		sleepHours: 8.1,
		hrvMs: 52,
		restingHr: 55,
		steps: 6200,
		activeEnergyKcal: 390,
	},
	{
		sleepHours: 6.9,
		hrvMs: 45,
		restingHr: 57,
		steps: 11200,
		activeEnergyKcal: 640,
	},
	{
		sleepHours: 7.4,
		hrvMs: 48,
		restingHr: 56,
		steps: 7800,
		activeEnergyKcal: 450,
	},
	{
		sleepHours: 7.8,
		hrvMs: 51,
		restingHr: 55,
		steps: 10400,
		activeEnergyKcal: 600,
	},
	{
		sleepHours: 8.3,
		hrvMs: 53,
		restingHr: 54,
		steps: 5400,
		activeEnergyKcal: 340,
	},
	{
		sleepHours: 7.1,
		hrvMs: 46,
		restingHr: 57,
		steps: 9600,
		activeEnergyKcal: 560,
	},
	{
		sleepHours: 7.5,
		hrvMs: 49,
		restingHr: 56,
		steps: 8800,
		activeEnergyKcal: 500,
	},
	{
		sleepHours: 6.8,
		hrvMs: 44,
		restingHr: 58,
		steps: 12300,
		activeEnergyKcal: 700,
	},
	{
		sleepHours: 7.7,
		hrvMs: 50,
		restingHr: 55,
		steps: 7300,
		activeEnergyKcal: 430,
	},
	{
		sleepHours: 7.9,
		hrvMs: 51,
		restingHr: 55,
		steps: 8100,
		activeEnergyKcal: 470,
	},
	{
		sleepHours: 7.3,
		hrvMs: 47,
		restingHr: 56,
		steps: 16800,
		activeEnergyKcal: 1150,
	},
	{
		sleepHours: 5.4,
		hrvMs: 34,
		restingHr: 62,
		steps: 2100,
		activeEnergyKcal: 120,
	},
];

function daysAgo(n: number): string {
	const d = new Date();
	d.setDate(d.getDate() - n);
	return d.toISOString().slice(0, 10);
}

export const mockHealth: DailyHealth[] = samples.map((s, i) => ({
	date: daysAgo(samples.length - 1 - i),
	...s,
}));

export type TodaySignals = Pick<
	DailyHealth,
	"sleepHours" | "hrvMs" | "restingHr"
>;

export const SIGNALS: {
	key: keyof TodaySignals;
	label: string;
	unit: string;
	min: number;
	max: number;
	step: number;
}[] = [
	{ key: "sleepHours", label: "Sleep", unit: "h", min: 3, max: 10, step: 0.1 },
	{ key: "hrvMs", label: "HRV", unit: "ms", min: 15, max: 90, step: 1 },
	{
		key: "restingHr",
		label: "Resting HR",
		unit: "bpm",
		min: 40,
		max: 90,
		step: 1,
	},
];

const last = samples[samples.length - 1];

export const PRESETS: { label: string; today: TodaySignals }[] = [
	{
		label: "Short night",
		today: {
			sleepHours: last.sleepHours,
			hrvMs: last.hrvMs,
			restingHr: last.restingHr,
		},
	},
	{
		label: "Well rested",
		today: { sleepHours: 8.2, hrvMs: 58, restingHr: 53 },
	},
	{
		label: "Stressful week",
		today: { sleepHours: 4.8, hrvMs: 26, restingHr: 68 },
	},
];

export const DEFAULT_TODAY = PRESETS[0].today;

// Clamps untrusted input to realistic ranges; missing values fall back to the demo story.
export function parseToday(input: unknown): TodaySignals {
	const raw = (input ?? {}) as Record<string, unknown>;
	const today = { ...DEFAULT_TODAY };
	for (const { key, min, max, step } of SIGNALS) {
		const value = Number(raw[key]);
		if (!Number.isFinite(value)) continue;
		const clamped = Math.min(max, Math.max(min, value));
		today[key] = Number(
			(Math.round(clamped / step) * step).toFixed(step < 1 ? 1 : 0),
		);
	}
	return today;
}

export function withToday(
	days: DailyHealth[],
	today: TodaySignals,
): DailyHealth[] {
	return days.map((d, i) => (i === days.length - 1 ? { ...d, ...today } : d));
}
