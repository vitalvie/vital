import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_API_URL, proxyHeaders, proxyUrl } from "#/lib/proxy";

// Forwards /api/* to the Python API. API_URL and PROXY_SECRET are server-side only.
async function forward(request: Request, splat = ""): Promise<Response> {
	const base = process.env.API_URL || DEFAULT_API_URL;
	const { search } = new URL(request.url);
	const hasBody = request.method !== "GET" && request.method !== "HEAD";
	try {
		const upstream = await fetch(proxyUrl(base, splat, search), {
			method: request.method,
			headers: proxyHeaders(request.headers, {
				secret: process.env.PROXY_SECRET,
			}),
			body: hasBody ? await request.arrayBuffer() : undefined,
		});
		const headers = new Headers();
		for (const name of ["content-type", "retry-after"]) {
			const value = upstream.headers.get(name);
			if (value) headers.set(name, value);
		}
		headers.set("cache-control", "no-store");
		return new Response(upstream.body, { status: upstream.status, headers });
	} catch {
		return Response.json(
			{ detail: "The API is unreachable." },
			{ status: 502 },
		);
	}
}

export const Route = createFileRoute("/api/$")({
	server: {
		handlers: {
			GET: ({ request, params }) => forward(request, params._splat),
			POST: ({ request, params }) => forward(request, params._splat),
		},
	},
});
