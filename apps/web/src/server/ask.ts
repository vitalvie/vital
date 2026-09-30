import { createServerFn } from "@tanstack/react-start";
import { mockHealth, parseToday, withToday } from "#/data/mock-health";
import { answerQuestion, MAX_QUESTION_LENGTH } from "./assistant";

export const askVital = createServerFn({ method: "POST" })
	.validator((data: unknown) => {
		const { question, today } = (data ?? {}) as Record<string, unknown>;
		if (typeof question !== "string" || !question.trim()) {
			throw new Error("Question is required");
		}
		return {
			question: question.trim().slice(0, MAX_QUESTION_LENGTH),
			today: parseToday(today),
		};
	})
	.handler(({ data }) =>
		answerQuestion(data.question, withToday(mockHealth, data.today)),
	);
