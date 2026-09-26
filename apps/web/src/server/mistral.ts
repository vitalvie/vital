import { Mistral } from "@mistralai/mistralai";

let client: Mistral | undefined;

export function mistral(): Mistral {
	const apiKey = process.env.MISTRAL_API_KEY;
	if (!apiKey) throw new Error("MISTRAL_API_KEY is not set");
	client ??= new Mistral({ apiKey });
	return client;
}
