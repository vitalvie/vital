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

const chip = "chip bg-white shadow-soft hover:bg-indigo-50";

// Latest GitHub release and CI status on main, as two linked chips.
export function ReleaseFooter({ release }: { release: ReleaseStatus }) {
	return (
		<p className="flex flex-wrap items-center gap-2">
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
