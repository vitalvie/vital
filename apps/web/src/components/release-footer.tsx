import { GithubIcon } from "#/components/icons";
import type { CiState, ReleaseStatus } from "#/lib/release";

const CI_LABEL: Record<CiState, string> = {
	passing: "Passing",
	failing: "Failing",
	running: "Running",
	unknown: "CI",
};

const CI_DOT: Record<CiState, string> = {
	passing: "bg-good",
	failing: "bg-bad",
	running: "bg-warn",
	unknown: "bg-caption",
};

const chip =
	"inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium shadow-soft transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-500";

export function ReleaseFooter({ release }: { release: ReleaseStatus }) {
	return (
		<p className="mt-3 flex flex-wrap items-center justify-center gap-2">
			<a
				href={release.releaseUrl}
				className={`${chip} text-heading`}
				aria-label={`Release ${release.version} on GitHub`}
			>
				<GithubIcon />
				{release.version}
			</a>
			<a
				href={release.ciUrl}
				className={`${chip} text-caption`}
				aria-label={`CI ${CI_LABEL[release.ci]} on main`}
			>
				<span
					className={`size-1.5 rounded-full ${CI_DOT[release.ci]}`}
					aria-hidden="true"
				/>
				{CI_LABEL[release.ci]}
			</a>
		</p>
	);
}
