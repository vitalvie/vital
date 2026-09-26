const base = {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
} as const;

export function MicIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<rect x="9" y="3" width="6" height="11" rx="3" />
			<path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
		</svg>
	);
}

export function StopIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<rect x="7" y="7" width="10" height="10" rx="2" />
		</svg>
	);
}

export function CloseIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M6 6l12 12M18 6L6 18" />
		</svg>
	);
}

export function ArrowUpIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M12 19V5M5 12l7-7 7 7" />
		</svg>
	);
}
