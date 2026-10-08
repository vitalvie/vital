# Vital

> Ask your body — anything

Voice companion for everyday energy. Ask a question out loud, get a short spoken answer grounded in (mocked) HealthKit data. The web app is a product-led landing page: the hero sells the product with the watch on show, the working demo sits right below it, and the following sections explain how it works, why it is safe, and how it is built.

**Single monorepo.** Everything lives here. No sibling repos, no Swift.

## Project structure

```
apps/web/               # TanStack Start app (React + TypeScript + Tailwind)
  src/routes/           # File-based routes. `index.tsx` composes the landing page
  src/components/       # One component per file, kebab-case (see below)
  src/data/             # Mocked HealthKit data and sample days
  src/lib/              # Pure logic (tested), the voice session hook, API client, audio
  src/server/           # Server function for the release and CI status
  src/styles.css        # Design tokens (`@theme`) and the few shared CSS classes
  public/               # Favicon, share image, self-hosted Alan Sans
apps/api/               # FastAPI app (Python, Pydantic, LangGraph, Voxtral STT/TTS)
docs/                   # Mintlify docs (product + engineering)
public/                 # Static assets used by README.md
```

### Landing page

`src/routes/index.tsx` renders the sections in reading order. The hero watch plays a scripted exchange (`src/lib/showcase.ts`) and is not interactive. The demo runs the real voice session from `useVital` (`src/lib/use-vital.ts`).

| Order | Section | Component | Anchor |
|-------|---------|-----------|--------|
| 0 | Sticky navigation | `site-nav.tsx` | |
| 1 | Hero: headline, call to action, tilted showcase watch, Body Battery preview | `hero.tsx` | |
| 2 | Full demo: watch, sample-day control, Body Battery, conversation | `demo-section.tsx` | `#demo` |
| 3 | How it works: Ask, Understand, Answer | `how-it-works.tsx` | `#how` |
| 4 | Benefits bento | `benefits.tsx` | |
| 5 | Safety | `safety.tsx` | `#safety` |
| 6 | Under the hood: pipeline diagram | `architecture.tsx` | `#stack` |
| 7 | Open source: licence, release, CI | `open-source.tsx` | `#open-source` |
| 8 | Final call to action | `final-cta.tsx` | |
| 9 | Footer with the medical disclaimer | `site-footer.tsx` | |

Product components: `watch`, `orb`, `signal-sources`, `body-battery-card`, `battery-preview`, `energy-gauge`, `level-pill`, `conversation`, `ask-bar`, `notice-card`, `scenario-control`, `demo-data-panel`, `release-footer`. Building blocks: `section-heading`, `reveal`, `logo`, `icons`.

## Commands

```bash
pnpm install
pnpm dev          # API on :8000 and web app on :3000 (needs apps/web/.env, see .env.example)
pnpm check        # Biome + TypeScript
pnpm test         # Vitest and pytest
pnpm eval         # Live guardrail evals: OpenRouter answers, Jev judges (apps/api/tests/test_eval.py)
pnpm run deploy   # Tagged release from main to Cloudflare Workers (see docs/releases.mdx)
pnpm build
pnpm docs         # Mintlify preview (Node 22 via npx)
pnpm docs:check   # Mintlify broken links
```

## Conventions

- The OpenRouter key stays in the Python API (`apps/api`). The web app only calls it.
- Import app code with the `#/` alias (`#/lib/energy`).
- Biome formatting: tabs, double quotes. Run `pnpm check` and `pnpm test` before committing.
- Pure logic in `src/lib/` gets a `*.test.ts` next to it.
- React and Tailwind only. No UI library. Reach for CSS and the Web Animations API before a motion library, and add any dependency only with a clear reason.
- CI (`.github/workflows/ci.yml`) runs check, test, build, live evals and docs broken links on every PR.
- Prompt or model changes: update `apps/api/vital_api/agent.py`, add an eval case, run `pnpm eval`. See `docs/safety.mdx`.
- Releases: semver from `0.1.0` in `apps/web/package.json` (`1.0.0` is a stable product, not the first demo). Tag `vX.Y.Z` on `main`, then `pnpm run deploy`. PRs and release notes stay short and use one shape. See `docs/releases.mdx`.
- Docs: every new page is registered in `docs/docs.json`; update docs when behavior changes. `docs/design-notes.md` is an internal note, not a published page.
- Do not modify `README.md` unless explicitly asked.

## Design

Source of truth: `docs/design-system.mdx`. Tokens in `apps/web/src/styles.css`. Intent and trade-offs: `docs/design-notes.md`.

- **The hero sells, the demo proves.** The hero shows the watch at an angle, playing a scripted exchange, with one call to action. The live demo is one click below. Keep the showcase honest: real UI, an answer the product could give, sample data.
- **One main action per screen:** reach the demo, then talk to Vital. Everything else supports it. Details come on demand (collapsible demo control, sliders behind "Adjust numbers").
- **Look:** Alan Sans, cream background, indigo primary, one pastel block per section, one deep `night` block. Very large radii, diffuse shadows, no hard borders, no pure black. Vital has its own wordmark; never use another brand's logo or assets.
- **Tokens only.** Colors, the fluid type scale (`text-display`, `text-title`, `text-subtitle`, `text-lead`), page rhythm (`shell`, `py-section`), radii and shadows come from `@theme`. Add a token rather than a one-off value.
- **Mobile first.** Design at 360 to 430 px, then tablet and desktop. Touch targets are at least 44 px (`chip` and `btn` handle it). Respect iOS safe areas and use `dvh`.
- **Motion explains, never decorates.** Animate `transform` and `opacity` only, 150 to 500 ms, `ease-smooth`. Wrap below-the-fold content in `Reveal`. A global rule ends all motion under `prefers-reduced-motion`.
- **Every state is designed:** idle, listening, thinking, speaking, API failure, mic denied, "Mic needs HTTPS", long answers, loading (skeletons, not spinners). Copy for problems lives in `src/lib/notice.ts`.
- **Accessibility:** WCAG AA contrast, one global focus ring, an accessible name on every control, landmarks and one `h1`, answers in an `aria-live` region.
- **Honest proof only.** No testimonials, customer logos or invented numbers. Proof is the open-source repo, CI status, and the evals. Sample data is always labeled as such.

### Adding a section

1. Create `src/components/<name>.tsx` with a `<section aria-labelledby>` and a `SectionHeading`.
2. Use `shell` for the container. Give the section its own pastel block (`rounded-5xl`) or leave it on cream, alternating with its neighbors.
3. Wrap content in `Reveal`; stagger siblings with `delay`.
4. Add it to `src/routes/index.tsx`, and to the navigation in `site-nav.tsx` if it needs an anchor (`scroll-mt-24`).
5. Check 360, 390, 430, 768, 1024 and 1440 px, then update the tables here and in `docs/design-system.mdx`.

### Adding a component

One per file, kebab-case, with a one-line comment saying what it is for. Reuse `btn`, `chip`, `eyebrow`, `LevelPill`, `EnergyGauge` and `NoticeCard` before writing new ones. Small private helpers may live in the same file.

## Commit scopes

| Scope | Covers |
|-------|--------|
| `web` | `apps/web/` |
| `api` | `apps/api/` |
| `docs` | `docs/` |
| `repo` | Root config, tooling, rules |

## Key constraints

- No medical diagnosis, no medical claim, no promise of a health result. Always recommend a professional.
- No secrets in code — env vars only (`OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `VOXTRAL_VOICE`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `TYPESAFE_API_KEY`)
- Chat goes through a LangGraph agent on OpenRouter (`apps/api/vital_api/agent.py`). Speech-to-text and text-to-speech stay in `apps/api/vital_api/voice.py`. Tool inputs use Pydantic.
- Code and comments in English
- Health data is mocked and shaped like Apple HealthKit types. No accounts, no real health data.
