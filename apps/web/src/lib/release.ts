const REPO = "vitalvie/vital";

export const ACTIONS_URL = `https://github.com/${REPO}/actions/workflows/ci.yml?query=branch%3Amain`;

export type CiState = "passing" | "failing" | "running" | "unknown";

export type ReleaseStatus = {
	version: string;
	releaseUrl: string;
	ci: CiState;
	ciUrl: string;
};

type Run = {
	status?: string;
	conclusion?: string | null;
	html_url?: string;
};

const FAILING = new Set([
	"failure",
	"cancelled",
	"timed_out",
	"action_required",
]);

export function ciState(run: Run | null | undefined): CiState {
	if (!run?.status) return "unknown";
	if (run.status !== "completed") return "running";
	if (run.conclusion === "success") return "passing";
	if (run.conclusion && FAILING.has(run.conclusion)) return "failing";
	return "unknown";
}

export function fallbackRelease(version: string): ReleaseStatus {
	const tag = version.startsWith("v") ? version : `v${version}`;
	return {
		version: tag,
		releaseUrl: `https://github.com/${REPO}/releases/tag/${tag}`,
		ci: "unknown",
		ciUrl: ACTIONS_URL,
	};
}

export async function loadRelease(
	version: string,
	fetchImpl: typeof fetch = fetch,
): Promise<ReleaseStatus> {
	const fallback = fallbackRelease(version);
	try {
		const headers = {
			Accept: "application/vnd.github+json",
			"User-Agent": "vital",
		};
		const [releaseRes, runsRes] = await Promise.all([
			fetchImpl(`https://api.github.com/repos/${REPO}/releases/latest`, {
				headers,
			}),
			fetchImpl(
				`https://api.github.com/repos/${REPO}/actions/workflows/ci.yml/runs?branch=main&per_page=1`,
				{ headers },
			),
		]);
		const release = releaseRes.ok
			? ((await releaseRes.json()) as { tag_name?: string; html_url?: string })
			: null;
		const runs = runsRes.ok
			? ((await runsRes.json()) as { workflow_runs?: Run[] })
			: null;
		const run = runs?.workflow_runs?.[0];
		return {
			version:
				typeof release?.tag_name === "string"
					? release.tag_name
					: fallback.version,
			releaseUrl:
				typeof release?.html_url === "string"
					? release.html_url
					: fallback.releaseUrl,
			ci: ciState(run),
			ciUrl: typeof run?.html_url === "string" ? run.html_url : ACTIONS_URL,
		};
	} catch {
		return fallback;
	}
}
