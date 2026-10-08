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

export function MicOffIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M9 9v2a3 3 0 0 0 5 2.2M15 9.5V6a3 3 0 0 0-5.7-1.3" />
			<path d="M5 11a7 7 0 0 0 11 5.7M19 11a7 7 0 0 1-.6 2.8M12 18v3M4 4l16 16" />
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

export function ArrowDownIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M12 5v14M5 12l7 7 7-7" />
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

export function MenuIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M4 8h16M4 16h16" />
		</svg>
	);
}

export function ChevronDownIcon({ size = 16 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M6 9l6 6 6-6" />
		</svg>
	);
}

export function ArrowRightIcon({ size = 18 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M5 12h14M13 6l6 6-6 6" />
		</svg>
	);
}

export function ShieldIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M12 3l7 3v5c0 4.5-2.9 8.3-7 10-4.1-1.7-7-5.5-7-10V6l7-3z" />
			<path d="M9 12l2.2 2.2L15 10" />
		</svg>
	);
}

export function HandshakeIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21a8 8 0 0 1 16 0M12 13v4M10 15h4" />
		</svg>
	);
}

export function TargetIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<circle cx="12" cy="12" r="9" />
			<circle cx="12" cy="12" r="4" />
			<path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
		</svg>
	);
}

export function CheckCircleIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<circle cx="12" cy="12" r="9" />
			<path d="M8 12.5l2.7 2.7L16 9.5" />
		</svg>
	);
}

export function TextIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M5 7h14M5 12h14M5 17h8" />
		</svg>
	);
}

export function GraphIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<circle cx="6" cy="6" r="2.5" />
			<circle cx="18" cy="12" r="2.5" />
			<circle cx="6" cy="18" r="2.5" />
			<path d="M8.5 6H12a3.5 3.5 0 0 1 3.5 3.5M8.5 18H12a3.5 3.5 0 0 0 3.5-3.5" />
		</svg>
	);
}

export function SparkIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8L12 4z" />
		</svg>
	);
}

export function SpeakerIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M4 10v4h3l5 4V6L7 10H4z" />
			<path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
		</svg>
	);
}

export function MoonIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
		</svg>
	);
}

export function HeartIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
		</svg>
	);
}

export function PulseIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M3 12h4l2.5-6 4 12 2.5-6h5" />
		</svg>
	);
}

export function FlameIcon({ size = 24 }: { size?: number }) {
	return (
		<svg width={size} height={size} aria-hidden="true" {...base}>
			<path d="M12 3c1 3.5 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4 .2 1.5 1 2.5 2 3 0-3 .5-6 1-9z" />
		</svg>
	);
}
