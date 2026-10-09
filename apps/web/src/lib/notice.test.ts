import { describe, expect, it } from "vitest";
import { micSupport, NOTICES, noticeKind, VitalError } from "./notice";

describe("micSupport", () => {
	it("is ready on a secure page that can record", () => {
		expect(micSupport({ secure: true, recorder: true })).toBe("ready");
	});

	it("blames HTTPS first, since an insecure page hides the recorder", () => {
		expect(micSupport({ secure: false, recorder: false })).toBe("insecure");
		expect(micSupport({ secure: false, recorder: true })).toBe("insecure");
	});

	it("reports a browser without recording", () => {
		expect(micSupport({ secure: true, recorder: false })).toBe("unsupported");
	});
});

describe("noticeKind", () => {
	it("keeps the kind of a known error", () => {
		expect(noticeKind(new VitalError("unheard"))).toBe("unheard");
	});

	it("reads a network failure as offline", () => {
		expect(noticeKind(new TypeError("Failed to fetch"))).toBe("offline");
	});

	it("falls back to a generic failure", () => {
		expect(noticeKind(new Error("Internal Server Error"))).toBe("failed");
		expect(noticeKind("boom")).toBe("failed");
	});
});

describe("NOTICES", () => {
	it("never leaks technical wording", () => {
		for (const { title, hint } of Object.values(NOTICES)) {
			expect(`${title} ${hint}`).not.toMatch(/error|fetch|status|null/i);
		}
	});

	it("does not offer an instant retry when the limit was hit", () => {
		expect("action" in NOTICES.busy).toBe(false);
	});

	it("offers a next step whenever a retry can help", () => {
		expect(NOTICES.offline.action).toBe("retry");
		expect(NOTICES.failed.action).toBe("retry");
		expect(NOTICES.insecure.action).toBe("secure");
	});
});
