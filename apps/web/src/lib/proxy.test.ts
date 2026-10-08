import { describe, expect, it } from "vitest";
import { PROXY_HEADER, proxyHeaders, proxyUrl } from "./proxy";

describe("proxyUrl", () => {
	it("joins the API base and the path after /api", () => {
		expect(proxyUrl("http://127.0.0.1:8000", "ask")).toBe(
			"http://127.0.0.1:8000/ask",
		);
	});

	it("tolerates stray slashes and keeps the query", () => {
		expect(proxyUrl("https://api.example.com/", "/health", "?x=1")).toBe(
			"https://api.example.com/health?x=1",
		);
	});
});

describe("proxyHeaders", () => {
	const incoming = new Headers({
		"content-type": "application/json",
		cookie: "session=abc",
		host: "vital.example.com",
		"cf-connecting-ip": "203.0.113.7",
		"x-forwarded-for": "1.2.3.4",
		[PROXY_HEADER]: "guess",
	});

	it("passes the body type and the visitor's address, and nothing private", () => {
		const headers = proxyHeaders(incoming, {});
		expect(headers.get("content-type")).toBe("application/json");
		expect(headers.get("x-forwarded-for")).toBe("203.0.113.7");
		expect(headers.get("cookie")).toBeNull();
		expect(headers.get("host")).toBeNull();
	});

	it("never forwards a secret the browser sent, only the server's own", () => {
		expect(proxyHeaders(incoming, {}).get(PROXY_HEADER)).toBeNull();
		expect(proxyHeaders(incoming, { secret: "real" }).get(PROXY_HEADER)).toBe(
			"real",
		);
	});

	it("does not trust a forwarded address the browser made up", () => {
		const spoofed = new Headers({ "x-forwarded-for": "1.2.3.4" });
		expect(proxyHeaders(spoofed, {}).get("x-forwarded-for")).toBeNull();
	});
});
