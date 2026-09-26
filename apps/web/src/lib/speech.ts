// Thin wrappers around the browser Web Speech API (best support: Chrome, Edge, Safari).

type Recognition = {
	lang: string;
	interimResults: boolean;
	onresult: (e: {
		results: ArrayLike<ArrayLike<{ transcript: string }>>;
	}) => void;
	onerror: () => void;
	onend: () => void;
	start: () => void;
	stop: () => void;
};

type RecognitionCtor = new () => Recognition;

function recognitionCtor(): RecognitionCtor | undefined {
	if (typeof window === "undefined") return undefined;
	const w = window as unknown as {
		SpeechRecognition?: RecognitionCtor;
		webkitSpeechRecognition?: RecognitionCtor;
	};
	return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export const canListen = () => recognitionCtor() !== undefined;

// Resolves with the transcript, or an empty string if nothing was heard.
export function listen(lang = "en-US"): Promise<string> {
	const Ctor = recognitionCtor();
	if (!Ctor) return Promise.reject(new Error("Speech recognition unsupported"));

	return new Promise((resolve) => {
		const rec = new Ctor();
		let transcript = "";
		rec.lang = lang;
		rec.interimResults = false;
		rec.onresult = (e) => {
			transcript = e.results[0][0].transcript;
		};
		rec.onerror = () => {};
		rec.onend = () => resolve(transcript);
		rec.start();
	});
}

export function speak(text: string, lang = "en-US"): Promise<void> {
	return new Promise((resolve) => {
		speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = lang;
		utterance.onend = () => resolve();
		utterance.onerror = () => resolve();
		speechSynthesis.speak(utterance);
	});
}
