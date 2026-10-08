// The browser only ever calls /api on its own origin. The web server forwards those calls to the Python API,
// so the API's address and secret never reach the client.

export const DEFAULT_API_URL = "http://127.0.0.1:8000";

// Header that tells the API a call comes from the web server. Must match PROXY_HEADER in apps/api.
export const PROXY_HEADER = "x-vital-proxy";

// Headers worth passing on. Everything else (cookies, host, hop-by-hop) stays behind.
const FORWARDED = ["accept", "content-type", "content-length"];

export function proxyUrl(base: string, splat: string, search = ""): string {
	const path = splat.replace(/^\/+/, "");
	return `${base.replace(/\/+$/, "")}/${path}${search}`;
}

export function proxyHeaders(
	incoming: Headers,
	env: { secret?: string },
): Headers {
	const headers = new Headers();
	for (const name of FORWARDED) {
		const value = incoming.get(name);
		if (value) headers.set(name, value);
	}
	// On Cloudflare this is the visitor's address. The API rate-limits on it.
	const client = incoming.get("cf-connecting-ip");
	if (client) headers.set("x-forwarded-for", client);
	if (env.secret) headers.set(PROXY_HEADER, env.secret);
	return headers;
}
