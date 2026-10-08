import { type ReactNode, useEffect, useRef } from "react";

type Props = {
	children: ReactNode;
	// Milliseconds to wait once in view, to stagger siblings.
	delay?: number;
	className?: string;
};

// Fades content up the first time it scrolls into view.
// Server markup stays visible: only what starts below the fold is hidden, after hydration.
export function Reveal({ children, delay = 0, className = "" }: Props) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el || !("IntersectionObserver" in window)) return;
		if (el.getBoundingClientRect().top < window.innerHeight) return;
		el.dataset.reveal = "pending";
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				el.dataset.reveal = "shown";
				observer.disconnect();
			},
			{ rootMargin: "0px 0px -8% 0px" },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={`reveal ${className}`}
			style={delay ? { transitionDelay: `${delay}ms` } : undefined}
		>
			{children}
		</div>
	);
}
