import { createServerFn } from "@tanstack/react-start";
import { mistral } from "./mistral";

const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

// Voxtral Mini Transcribe: recorded audio in, text out.
export const transcribe = createServerFn({ method: "POST" })
	.validator((data: unknown) => {
		const audio = data instanceof FormData ? data.get("audio") : null;
		if (!(audio instanceof File)) throw new Error("Audio is required");
		if (audio.size > MAX_AUDIO_BYTES) throw new Error("Recording is too long");
		return audio;
	})
	.handler(async ({ data: audio }) => {
		const res = await mistral().audio.transcriptions.complete({
			model: "voxtral-mini-latest",
			file: { fileName: audio.name, content: audio },
			language: "en",
		});
		return res.text.trim();
	});

// Voxtral TTS: text in, base64 mp3 out.
export const synthesize = createServerFn({ method: "POST" })
	.validator((text: unknown) => {
		if (typeof text !== "string" || !text.trim()) {
			throw new Error("Text is required");
		}
		return text.slice(0, 800);
	})
	.handler(async ({ data: text }) => {
		const res = await mistral().audio.speech.complete({
			model: "voxtral-mini-tts-2603",
			input: text,
			voiceId: process.env.VOXTRAL_VOICE || "gb_jane_neutral",
			responseFormat: "mp3",
		});
		return res.audioData;
	});
