// The Apple apps whose data Vital's sample mirrors, shown around the hero watch.
// The icons are Apple's own artwork (public/apple/), used to name those apps. See the footer notice.
const SOURCES: { label: string; icon: string; shape: string; place: string }[] =
	[
		{
			label: "Sleep",
			icon: "/apple/sleep.png",
			shape: "rounded-full",
			place: "lg:top-[40%] lg:-left-9",
		},
		{
			label: "Heart Rate",
			icon: "/apple/heart-rate.png",
			shape: "rounded-full",
			place: "lg:top-4 lg:right-2 xl:right-8",
		},
		{
			label: "Health",
			icon: "/apple/health.png",
			shape: "rounded-[22%]",
			place: "lg:top-[46%] lg:-right-7",
		},
		{
			label: "Fitness",
			icon: "/apple/fitness.png",
			shape: "rounded-[22%]",
			place: "lg:right-4 lg:bottom-14",
		},
	];

// A row under the watch on phones; floating around it from `lg`.
export function SignalSources() {
	return (
		<ul
			aria-label="Apple apps the sample data is shaped like"
			className="pointer-events-none relative z-20 mt-5 flex justify-center gap-3 sm:gap-5 lg:static lg:mt-0"
		>
			{SOURCES.map((s, i) => (
				<li
					key={s.label}
					className={`animate-fade-up lg:absolute ${s.place}`}
					style={{ animationDelay: `${600 + i * 120}ms` }}
				>
					<div
						className="lg:animate-float flex w-16 flex-col items-center gap-1.5"
						style={{ animationDelay: `${i * -1500}ms` }}
					>
						<img
							src={s.icon}
							alt=""
							width={56}
							height={56}
							className={`size-14 shadow-lift ${s.shape}`}
						/>
						<span className="text-xs leading-none font-medium whitespace-nowrap text-heading">
							{s.label}
						</span>
					</div>
				</li>
			))}
		</ul>
	);
}
