// Short, warm messages for the moments when Vital can't answer or can't listen.

export type NoticeAction = "retry" | "type" | "secure";

export type Notice = {
	title: string;
	hint: string;
	action?: NoticeAction;
};

export const NOTICES = {
	insecure: {
		title: "Mic needs HTTPS",
		hint: "Browsers only share the microphone on a secure page. Open the secure link, or type your question.",
		action: "secure",
	},
	unsupported: {
		title: "Voice isn't available here",
		hint: "This browser can't record audio. Type your question instead.",
		action: "type",
	},
	blocked: {
		title: "The mic is switched off",
		hint: "Allow the microphone in your browser's site settings, then tap the watch again. Typing works too.",
		action: "type",
	},
	unheard: {
		title: "I didn't catch that",
		hint: "Tap the watch and try once more, a little closer to the mic.",
	},
	empty: {
		title: "I don't have an answer for that one",
		hint: "Try asking it another way.",
		action: "type",
	},
	offline: {
		title: "I can't reach Vital right now",
		hint: "Check your connection, then try again.",
		action: "retry",
	},
	failed: {
		title: "Something went wrong on my side",
		hint: "Nothing you did. Give it another go.",
		action: "retry",
	},
} satisfies Record<string, Notice>;

export type NoticeKind = keyof typeof NOTICES;

// An error the interface knows how to explain.
export class VitalError extends Error {
	constructor(readonly kind: NoticeKind) {
		super(NOTICES[kind].title);
		this.name = "VitalError";
	}
}

// fetch rejects with a TypeError when the network or the API is unreachable.
export function noticeKind(error: unknown): NoticeKind {
	if (error instanceof VitalError) return error.kind;
	return error instanceof TypeError ? "offline" : "failed";
}

export type Mic = "ready" | "insecure" | "unsupported" | "blocked";

// Recording needs a secure page (HTTPS or localhost) and the MediaRecorder API.
export function micSupport(env: { secure: boolean; recorder: boolean }): Mic {
	if (!env.secure) return "insecure";
	return env.recorder ? "ready" : "unsupported";
}
