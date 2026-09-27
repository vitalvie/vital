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

export function GithubIcon({ size = 14 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
			<path
				fill="currentColor"
				d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
			/>
		</svg>
	);
}

export function SlidersIcon({ size = 16 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
			<circle cx="16" cy="6" r="2" />
			<circle cx="10" cy="12" r="2" />
			<circle cx="18" cy="18" r="2" />
		</svg>
	);
}
