import type { TodaySignals } from "#/data/mock-health";
import { VitalError } from "#/lib/notice";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Prior = { question: string; answer: string };

async function fail(res: Response): Promise<never> {
	let message = res.statusText || "Something went wrong";
	try {
		const body = (await res.json()) as { detail?: unknown };
		if (typeof body.detail === "string" && body.detail) message = body.detail;
	} catch {
		// The body is not JSON.
	}
	throw new Error(message);
}

export async function askVital(input: {
	question: string;
	today: TodaySignals;
	prior?: Prior;
}): Promise<string> {
	const res = await fetch(`${API}/ask`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	if (!res.ok) return fail(res);
	const body = (await res.json()) as { text?: string };
	if (!body.text) throw new VitalError("empty");
	return body.text;
}

export async function transcribe(form: FormData): Promise<string> {
	const res = await fetch(`${API}/transcribe`, { method: "POST", body: form });
	if (!res.ok) return fail(res);
	const body = (await res.json()) as { text?: string };
	return body.text?.trim() ?? "";
}

export async function synthesize(text: string): Promise<string> {
	const res = await fetch(`${API}/synthesize`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text }),
	});
	if (!res.ok) return fail(res);
	const body = (await res.json()) as { audio?: string };
	if (!body.audio) throw new Error("Empty audio");
	return body.audio;
}
