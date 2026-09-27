import { createServerFn } from "@tanstack/react-start";
import { loadRelease, type ReleaseStatus } from "#/lib/release";

const TTL_MS = 60_000;

let cached: { at: number; value: ReleaseStatus } | undefined;

export const getRelease = createServerFn({ method: "GET" }).handler(
	async () => {
		if (cached && Date.now() - cached.at < TTL_MS) return cached.value;
		const value = await loadRelease(__APP_VERSION__);
		cached = { at: Date.now(), value };
		return value;
	},
);
