// Browser audio helpers. Microphone access needs HTTPS or localhost.

export const canRecord = () =>
	typeof window !== "undefined" &&
	!!navigator.mediaDevices?.getUserMedia &&
	typeof MediaRecorder !== "undefined";

// Starts recording and returns a function that stops it and resolves with the audio file.
export async function startRecording(): Promise<() => Promise<File>> {
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
	const recorder = new MediaRecorder(stream);
	const chunks: Blob[] = [];
	recorder.ondataavailable = (e) => chunks.push(e.data);
	recorder.start();

	return () =>
		new Promise((resolve) => {
			recorder.onstop = () => {
				for (const track of stream.getTracks()) track.stop();
				const type = recorder.mimeType || "audio/webm";
				const ext = type.includes("mp4") ? "m4a" : "webm";
				resolve(new File(chunks, `question.${ext}`, { type }));
			};
			recorder.stop();
		});
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
