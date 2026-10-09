const OPENROUTER = "https://openrouter.ai/api/v1";

export const DEFAULT_MODEL = "mistralai/mistral-small-3.2-24b-instruct";
const TRANSCRIBE_MODEL = "mistralai/voxtral-mini-transcribe";
const SPEECH_MODEL = "mistralai/voxtral-mini-tts-2603";

export function chatModel() {
	return process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
}

function apiKey() {
	const key = process.env.OPENROUTER_API_KEY;
	if (!key) throw new Error("OPENROUTER_API_KEY is not set");
	return key;
}

function headers() {
	return {
		Authorization: `Bearer ${apiKey()}`,
		"Content-Type": "application/json",
		"HTTP-Referer": "https://vital.vitalvie.workers.dev",
		"X-OpenRouter-Title": "Vital",
	};
}

async function failure(res: Response, label: string) {
	let message = res.statusText;
	try {
		const body = (await res.json()) as { error?: { message?: string } };
		if (body.error?.message) message = body.error.message;
	} catch {
		// The body is not JSON.
	}
	throw new Error(`${label} failed (${res.status}): ${message}`);
}

export function messageText(content: unknown): string {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content
		.map((part) => {
			if (typeof part === "string") return part;
			if (
				part &&
				typeof part === "object" &&
				"text" in part &&
				typeof part.text === "string"
			) {
				return part.text;
			}
			return "";
		})
		.join("");
}

export function audioFormat(type: string, name: string) {
	const hint = `${type} ${name}`.toLowerCase();
	if (hint.includes("wav")) return "wav";
	if (hint.includes("mpeg") || hint.includes("mp3")) return "mp3";
	if (hint.includes("mp4") || hint.includes("m4a") || hint.includes("aac"))
		return "m4a";
	if (hint.includes("flac")) return "flac";
	if (hint.includes("ogg")) return "ogg";
	return "webm";
}

function bytesToBase64(bytes: Uint8Array) {
	let binary = "";
	const chunk = 0x8000;
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	}
	return btoa(binary);
}

export async function completeChat(
	messages: { role: "system" | "user" | "assistant"; content: string }[],
) {
	const res = await fetch(`${OPENROUTER}/chat/completions`, {
		method: "POST",
		headers: headers(),
		body: JSON.stringify({
			model: chatModel(),
			temperature: 0.3,
			max_tokens: 200,
			messages,
		}),
	});
	if (!res.ok) await failure(res, "OpenRouter chat");

	const body = (await res.json()) as {
		choices?: { message?: { content?: unknown } }[];
	};
	const text = messageText(body.choices?.[0]?.message?.content).trim();
	if (!text) throw new Error("Empty answer");
	return text;
}

export async function transcribeAudio(file: File) {
	const bytes = new Uint8Array(await file.arrayBuffer());
	const res = await fetch(`${OPENROUTER}/audio/transcriptions`, {
		method: "POST",
		headers: headers(),
		body: JSON.stringify({
			model: TRANSCRIBE_MODEL,
			language: "en",
			input_audio: {
				data: bytesToBase64(bytes),
				format: audioFormat(file.type, file.name),
			},
		}),
	});
	if (!res.ok) await failure(res, "OpenRouter transcription");

	const body = (await res.json()) as { text?: string };
	const text = body.text?.trim() ?? "";
	if (!text) throw new Error("Empty transcription");
	return text;
}

export async function synthesizeSpeech(text: string) {
	const res = await fetch(`${OPENROUTER}/audio/speech`, {
		method: "POST",
		headers: headers(),
		body: JSON.stringify({
			model: SPEECH_MODEL,
			input: text,
			voice: process.env.VOXTRAL_VOICE || "gb_jane_neutral",
			response_format: "mp3",
		}),
	});
	if (!res.ok) await failure(res, "OpenRouter speech");

	const bytes = new Uint8Array(await res.arrayBuffer());
	if (!bytes.length) throw new Error("Empty audio");
	return bytesToBase64(bytes);
}
