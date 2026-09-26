import { createServerFn } from "@tanstack/react-start";
import { mockHealth } from "#/data/mock-health";
import { answerQuestion, MAX_QUESTION_LENGTH } from "./assistant";
import { mistral } from "./mistral";

export const askVital = createServerFn({ method: "POST" })
	.validator((question: unknown) => {
		if (typeof question !== "string" || !question.trim()) {
			throw new Error("Question is required");
		}
		return question.trim().slice(0, MAX_QUESTION_LENGTH);
	})
	.handler(({ data }) => answerQuestion(mistral(), data, mockHealth));
