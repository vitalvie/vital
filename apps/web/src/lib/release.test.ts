import { describe, expect, it } from "vitest";
import { ciState, fallbackRelease, loadRelease } from "./release";

describe("ciState", () => {
	it("reads the latest workflow conclusion", () => {
		expect(ciState({ status: "completed", conclusion: "success" })).toBe(
			"passing",
		);
		expect(ciState({ status: "completed", conclusion: "failure" })).toBe(
			"failing",
		);
		expect(ciState({ status: "in_progress", conclusion: null })).toBe(
			"running",
		);
		expect(ciState(null)).toBe("unknown");
	});
});

describe("loadRelease", () => {
	it("uses the latest GitHub release and the main CI run", async () => {
		const fetchImpl = (async (url: string) => {
			if (String(url).includes("/releases/latest")) {
				return Response.json({
					tag_name: "v0.1.1",
					html_url: "https://github.com/vitalvie/vital/releases/tag/v0.1.1",
				});
			}
			return Response.json({
				workflow_runs: [
					{
						status: "completed",
						conclusion: "success",
						html_url: "https://github.com/vitalvie/vital/actions/runs/1",
					},
				],
			});
		}) as typeof fetch;

		await expect(loadRelease("9.9.9", fetchImpl)).resolves.toEqual({
			version: "v0.1.1",
			releaseUrl: "https://github.com/vitalvie/vital/releases/tag/v0.1.1",
			ci: "passing",
			ciUrl: "https://github.com/vitalvie/vital/actions/runs/1",
		});
	});

	it("falls back to the built version when GitHub is unreachable", async () => {
		const fetchImpl = (async () => {
			throw new Error("offline");
		}) as typeof fetch;
		expect(await loadRelease("0.1.2", fetchImpl)).toEqual(
			fallbackRelease("0.1.2"),
		);
	});
});
