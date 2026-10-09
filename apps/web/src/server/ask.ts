import { createServerFn } from "@tanstack/react-start";
import { mockHealth, parseToday, withToday } from "#/data/mock-health";
import { answerQuestion, MAX_QUESTION_LENGTH } from "./assistant";

function parsePrior(prior: unknown) {
	if (!prior || typeof prior !== "object") return undefined;
	const { question, answer } = prior as Record<string, unknown>;
	if (typeof question !== "string" || typeof answer !== "string")
		return undefined;
	const trimmedQuestion = question.trim().slice(0, MAX_QUESTION_LENGTH);
	const trimmedAnswer = answer.trim().slice(0, 600);
	if (!trimmedQuestion || !trimmedAnswer) return undefined;
	return { question: trimmedQuestion, answer: trimmedAnswer };
}

export const askVital = createServerFn({ method: "POST" })
	.validator((data: unknown) => {
		const { question, today, prior } = (data ?? {}) as Record<string, unknown>;
		if (typeof question !== "string" || !question.trim()) {
			throw new Error("Question is required");
		}
		return {
			question: question.trim().slice(0, MAX_QUESTION_LENGTH),
			today: parseToday(today),
			prior: parsePrior(prior),
		};
	})
	.handler(({ data }) =>
		answerQuestion(
			data.question,
			withToday(mockHealth, data.today),
			data.prior,
		),
	);
