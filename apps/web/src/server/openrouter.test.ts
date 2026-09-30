import { describe, expect, it } from "vitest";
import { audioFormat, messageText } from "#/server/openrouter";

describe("messageText", () => {
	it("reads a string", () => {
		expect(messageText("hello")).toBe("hello");
	});

	it("joins text parts", () => {
		expect(messageText([{ type: "text", text: "hel" }, { text: "lo" }])).toBe(
			"hello",
		);
	});

	it("ignores anything else", () => {
		expect(messageText(null)).toBe("");
		expect(messageText([{ type: "image" }])).toBe("");
	});
});

describe("audioFormat", () => {
	it("maps a browser recording", () => {
		expect(audioFormat("audio/webm;codecs=opus", "question.webm")).toBe("webm");
		expect(audioFormat("audio/mp4", "question.m4a")).toBe("m4a");
		expect(audioFormat("audio/wav", "question.wav")).toBe("wav");
	});

	it("falls back to webm", () => {
		expect(audioFormat("", "")).toBe("webm");
	});
});
