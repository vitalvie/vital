import type { ReactNode } from "react";

type Props = {
	id: string;
	eyebrow: string;
	title: ReactNode;
	lead?: ReactNode;
	// Centered by default; sections with a side visual align left.
	align?: "center" | "left";
	// On the `night` block, text flips to light.
	tone?: "light" | "dark";
};

// Eyebrow pill, section title and one lead sentence. Used by every landing section.
export function SectionHeading({
	id,
	eyebrow,
	title,
	lead,
	align = "center",
	tone = "light",
}: Props) {
	const dark = tone === "dark";
	return (
		<div
			className={`flex max-w-3xl flex-col gap-4 ${align === "center" ? "mx-auto items-center text-center" : "items-start"}`}
		>
			<p className="eyebrow">{eyebrow}</p>
			<h2
				id={id}
				className={`text-title text-balance ${dark ? "text-white" : "text-heading"}`}
			>
				{title}
			</h2>
			{lead && (
				<p
					className={`max-w-xl text-lead text-pretty ${dark ? "text-indigo-100" : ""}`}
				>
					{lead}
				</p>
			)}
		</div>
	);
}
