import { useEffect, useState } from "react";
import { REPO_URL } from "#/lib/release";
import { CloseIcon, GithubIcon, MenuIcon } from "./icons";
import { Logo } from "./logo";

const LINKS = [
	{ href: "#how", label: "How it works" },
	{ href: "#safety", label: "Safety" },
	{ href: "#stack", label: "Under the hood" },
	{ href: "#open-source", label: "Open source" },
];

// Sticky pill-shaped navigation. Anchors collapse into a menu below `lg`.
export function SiteNav() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<header className="sticky top-0 z-40 pt-[max(0.75rem,env(safe-area-inset-top))]">
			<nav aria-label="Main" className="shell">
				<div className="flex h-14 items-center justify-between gap-3 rounded-full bg-white/85 pr-1.5 pl-5 shadow-soft backdrop-blur-md">
					<a
						href="#top"
						aria-label="Vital, back to top"
						className="text-heading"
					>
						<Logo />
					</a>
					<ul className="hidden items-center gap-1 lg:flex">
						{LINKS.map((l) => (
							<li key={l.href}>
								<a href={l.href} className="btn btn-ghost px-4 text-sm">
									{l.label}
								</a>
							</li>
						))}
					</ul>
					<div className="flex items-center gap-1">
						<a
							href={REPO_URL}
							aria-label="Vital on GitHub"
							className="btn btn-ghost hidden size-11 px-0 sm:flex"
						>
							<GithubIcon size={20} />
						</a>
						<a href="#try" className="btn btn-primary">
							Try it
						</a>
						<button
							type="button"
							aria-expanded={open}
							aria-controls="nav-menu"
							aria-label={open ? "Close menu" : "Open menu"}
							onClick={() => setOpen((v) => !v)}
							className="btn btn-ghost size-11 px-0 lg:hidden"
						>
							{open ? <CloseIcon /> : <MenuIcon />}
						</button>
					</div>
				</div>
				{open && (
					<ul
						id="nav-menu"
						className="animate-fade-up mt-2 flex flex-col rounded-3xl bg-white p-2 shadow-lift lg:hidden"
					>
						{[...LINKS, { href: REPO_URL, label: "GitHub" }].map((l) => (
							<li key={l.href}>
								<a
									href={l.href}
									onClick={() => setOpen(false)}
									className="btn btn-ghost w-full justify-start"
								>
									{l.label}
								</a>
							</li>
						))}
					</ul>
				)}
			</nav>
		</header>
	);
}
