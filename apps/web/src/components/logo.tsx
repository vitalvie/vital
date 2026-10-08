// The "vital" wordmark with its sign: a smiling orb and the ring it gives off.
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

// A friendly face on the orb: two eyes and a smile, a nod to Alan, who hosted the hackathon.
export function LogoMark({ size = 28 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 28 28"
			fill="none"
			aria-hidden="true"
			className="shrink-0 text-indigo-500"
		>
			<circle cx="13" cy="15" r="9" fill="currentColor" />
			<path
				d="M13 2.5A12.5 12.5 0 0 1 25.5 15"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				opacity="0.45"
			/>
			<g className="text-cream">
				<circle cx="9.8" cy="13.4" r="1.4" fill="currentColor" />
				<circle cx="16.2" cy="13.4" r="1.4" fill="currentColor" />
				<path
					d="M9.4 17.2c1 1.5 2.2 2.2 3.6 2.2s2.6-.7 3.6-2.2"
					stroke="currentColor"
					strokeWidth="1.7"
					strokeLinecap="round"
				/>
			</g>
		</svg>
	);
}
