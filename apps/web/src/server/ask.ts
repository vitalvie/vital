import { createServerFn } from "@tanstack/react-start";
import { mockHealth } from "#/data/mock-health";
import { computeEnergy } from "#/lib/energy";
import { mistral } from "./mistral";

const SYSTEM_PROMPT = `You are Vital, a friendly voice health assistant.
Your answer will be read aloud, so:
- Reply in 2 to 3 short sentences, plain text, no markdown or lists.
- Use the user's real numbers and compare them to their own baseline.
- Give one practical suggestion for today.
- Never diagnose or name medical conditions. If something looks concerning, suggest talking to a healthcare professional.
- If the data can't answer the question, say so briefly.`;

function healthContext(): string {
	const { score, contributors, yesterday } = computeEnergy(mockHealth);
	return JSON.stringify({
		bodyBattery: score,
		contributors: contributors.map((c) => ({
			...c,
			vsUsual: c.today > c.baseline ? "higher" : "lower",
		})),
		yesterday: {
			steps: yesterday.steps,
			activeEnergyKcal: yesterday.activeEnergyKcal,
		},
		last14Days: mockHealth,
	});
}

export const askVital = createServerFn({ method: "POST" })
	.validator((question: unknown) => {
		if (typeof question !== "string" || !question.trim()) {
			throw new Error("Question is required");
		}
		return question.trim().slice(0, 500);
	})
	.handler(async ({ data: question }) => {
		const res = await mistral().chat.complete({
			model: process.env.MISTRAL_MODEL || "mistral-small-latest",
			temperature: 0.4,
			messages: [
				{ role: "system", content: SYSTEM_PROMPT },
				{ role: "system", content: `User health data: ${healthContext()}` },
				{ role: "user", content: question },
			],
		});
		const content = res.choices[0]?.message?.content;
		if (typeof content !== "string") throw new Error("Empty answer");
		return content.trim();
	});
