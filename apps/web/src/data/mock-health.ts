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
