import { useEffect, useRef, useState } from "react";

// Position between two numbers at progress t (0 to 1), easing out.
export function tween(from: number, to: number, t: number): number {
	const p = Math.min(1, Math.max(0, t));
	return from + (to - from) * (1 - (1 - p) ** 3);
}

// Animates a displayed number toward its target. Jumps there under reduced motion.
export function useCountUp(target: number, duration = 600): number {
	const [value, setValue] = useState(target);
	const current = useRef(target);

	useEffect(() => {
		const from = current.current;
		if (from === target) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			current.current = target;
			setValue(target);
			return;
		}
		let frame = 0;
		const start = performance.now();
		const tick = (now: number) => {
			const t = (now - start) / duration;
			current.current = tween(from, target, t);
			setValue(current.current);
			if (t < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [target, duration]);

	return value;
}
