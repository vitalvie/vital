import { createServerFn } from "@tanstack/react-start";
import { synthesizeSpeech, transcribeAudio } from "#/server/openrouter";

const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

// Voxtral Mini Transcribe, through OpenRouter: recorded audio in, text out.
export const transcribe = createServerFn({ method: "POST" })
	.validator((data: unknown) => {
		const audio = data instanceof FormData ? data.get("audio") : null;
		if (!(audio instanceof File)) throw new Error("Audio is required");
		if (audio.size > MAX_AUDIO_BYTES) throw new Error("Recording is too long");
		return audio;
	})
	.handler(async ({ data: audio }) => {
		return transcribeAudio(audio);
	});

// Voxtral TTS, through OpenRouter: text in, base64 mp3 out.
export const synthesize = createServerFn({ method: "POST" })
	.validator((text: unknown) => {
		if (typeof text !== "string" || !text.trim()) {
			throw new Error("Text is required");
		}
		return text.slice(0, 800);
	})
	.handler(async ({ data: text }) => {
		return synthesizeSpeech(text);
	});
