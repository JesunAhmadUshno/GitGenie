# GitGenie

Unlock and track GitHub profile achievements with a modern interactive dashboard.

Live dashboard: https://jesunahmadushno.github.io/GitGenie/lab/ (the app itself: https://jesunahmadushno.github.io/GitGenie/)

The live dashboard (built from `site/`) runs GitGenie's achievement detectors in the browser,
compares them with the rules in `lib/utils/constants.ts`, and replays this repo's own badge
attempts (PRs #1, #2, #4 and issue #3) from git history and a dated `gh api` snapshot.

## Status

Phase 0/1. The Next.js app is a landing page plus four "coming soon" routes; the detector
engine in `lib/services/achievements.ts` is tested (`npm test`) but not yet called by any page,
and the Express server mounts only `/health`. See `docs/research-review.md` for the full
engineering review, what was fixed and what is still open.

## Why GitGenie?

GitGenie helps developers understand and pursue GitHub achievements through a polished UI, clear progress views, and practical guidance.

## Features

- Client-side achievement detectors for 8 badges (`lib/services/achievements.ts`)
- Badge rules in one place (`lib/utils/constants.ts`)
- Live dashboard with a rule playground and a recorded replay of this repo's badge trials
- Planned (not built yet): sign-in, per-user dashboard, guides, leaderboard

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- GitHub Actions

## Run Locally

```bash
npm install
npm test        # engine smoke tests (node:test, no extra dependencies)
npm run dev     # Next.js app at http://localhost:3000/GitGenie
```

Live dashboard:

```bash
cd site
npm ci
npm run build   # regenerates history from git log, runs the known-answer check, builds
npm run dev
```

## Deploy

- `.github/workflows/pages.yml` builds the Next.js app and `site/`, and publishes the app at `/GitGenie/` and the dashboard at `/GitGenie/lab/`.
- `.github/workflows/deploy-pages.yml` runs the engine tests and the Next.js build; it no longer deploys.

## Docs

- `docs/research-review.md` (engineering review and open gaps)
- `PROJECT_ARCHITECTURE.md`
- `IMPLEMENTATION_GUIDE.md`
- `GITHUB_PAGES_SETUP.md`
- `DOCKER_SETUP.md`

## Contributing

Contributions are welcome. Open an issue or PR with a clear description and screenshots for UI changes.

## Star the Repo

If this project helps you, please star it to support visibility.
