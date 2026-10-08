// The "vital" wordmark with its sign: a grinning orb and the ring it gives off.
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

// A happy face on the orb: squinting eyes and a wide grin. A nod to Alan, who hosted the hackathon,
// drawn for Vital: the face lives inside the orb, under the ring it gives off.
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
			<circle cx="13" cy="15.5" r="10" fill="currentColor" />
			<path
				d="M13 2A13.5 13.5 0 0 1 26.5 15.5"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
				opacity="0.45"
			/>
			<g className="text-cream">
				<path
					d="M7.3 14.1q1.7-2.7 3.4 0M15.3 14.1q1.7-2.7 3.4 0"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
				/>
				<path
					d="M8.2 16.8c1.4.6 3 .9 4.8.9s3.4-.3 4.8-.9c-.4 2.7-2.3 4.6-4.8 4.6s-4.4-1.9-4.8-4.6z"
					fill="currentColor"
				/>
			</g>
		</svg>
	);
}
