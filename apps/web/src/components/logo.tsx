// The "vital" wordmark with its sign: an orb and the ring it gives off.
export function Logo({ className = "" }: { className?: string }) {
	return (
		<span className={`flex items-center gap-2 ${className}`}>
			<LogoMark />
			<span className="text-[26px] leading-none font-bold tracking-tight">
				vital
			</span>
		</span>
	);
}

export function LogoMark({ size = 26 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 26 26"
			fill="none"
			aria-hidden="true"
			className="shrink-0 text-indigo-500"
		>
			<circle cx="12" cy="14" r="7" fill="currentColor" />
			<path
				d="M12 2.5a11.5 11.5 0 0 1 11.5 11.5"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				opacity="0.45"
			/>
		</svg>
	);
}
