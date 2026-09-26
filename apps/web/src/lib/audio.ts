// Browser audio helpers. Microphone access needs HTTPS or localhost.

export const canRecord = () =>
	typeof window !== "undefined" &&
	!!navigator.mediaDevices?.getUserMedia &&
	typeof MediaRecorder !== "undefined";

export type Recording = {
	stop: () => Promise<File>;
	level: () => number; // current mic volume, 0 to 1
};

export async function startRecording(): Promise<Recording> {
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
	const recorder = new MediaRecorder(stream);
	const chunks: Blob[] = [];
	recorder.ondataavailable = (e) => chunks.push(e.data);
	recorder.start();

	const ctx = new AudioContext();
	const analyser = ctx.createAnalyser();
	analyser.fftSize = 256;
	ctx.createMediaStreamSource(stream).connect(analyser);
	const samples = new Uint8Array(analyser.fftSize);

	const level = () => {
		analyser.getByteTimeDomainData(samples);
		let sum = 0;
		for (const s of samples) sum += ((s - 128) / 128) ** 2;
		return Math.min(1, Math.sqrt(sum / samples.length) * 4);
	};

	const stop = () =>
		new Promise<File>((resolve) => {
			recorder.onstop = () => {
				for (const track of stream.getTracks()) track.stop();
				ctx.close();
				const type = recorder.mimeType || "audio/webm";
				const ext = type.includes("mp4") ? "m4a" : "webm";
				resolve(new File(chunks, `question.${ext}`, { type }));
			};
			recorder.stop();
		});

	return { stop, level };
}

let current: HTMLAudioElement | undefined;

export function playMp3(base64: string): Promise<void> {
	stopAudio();
	const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
	current = audio;
	return new Promise((resolve) => {
		audio.onended = () => resolve();
		audio.onpause = () => resolve();
		audio.onerror = () => resolve();
		audio.play().catch(() => resolve());
	});
}

export function stopAudio() {
	current?.pause();
	current = undefined;
}
