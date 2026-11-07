# GitGenie engineering review

Reviewed on 2026-11-07 against `main` at `97f0670`, with fixes on branch `site/live-dashboard`.

GitGenie is a product app, not a research study, so this review grades **engineering rigor**
(question and scope, architecture, correctness, tests, evaluation, reproducibility, security,
deployment, docs, limitations). The rule is fix-or-justify: every gap that can be closed without
GPUs, paid APIs or long runs is closed in this change; each remaining gap names exactly what it needs.

## Overall grade

| | Before (`97f0670`) | After (this branch) |
|---|---|---|
| Overall | **D+** | **C+** |

The jump comes from fixing the detector's real defects, adding tests and a build-time
known-answer check, pinning dependencies, and replacing a broken Pages deploy with a working,
honest dashboard. It stops at C+ because the product itself is still a landing page: no sign-in,
no per-user flow, and the engine is not called by any page.

## Rubric

| Area | Before | After | What changed / what remains |
|---|---|---|---|
| Problem and scope | C | B- | The question ("which badges has a user earned, and how do I earn the rest?") is clear. The README claimed a working dashboard; it now states Phase 0/1 honestly. |
| Spec (single source of truth) | D | C | `constants.ts`, `achievements.ts` and `app/page.tsx` define some badges differently. The dashboard now parses `constants.ts` at build time and flags every spec vs engine disagreement. Open: icons and Heart On Your Sleeve still differ between files (see gaps). |
| Correctness | D- | B- | Five defects fixed with tests (below). |
| Architecture | C- | C | Planned stack (Next, Express, Prisma/Postgres, Redis, K8s) is mostly unbuilt; the dashboard's architecture window shows built vs planned from the files present. |
| Tests | F | B- | Zero tests and an uninstalled `vitest` before. Now `npm test` runs 7 `node:test` smoke tests with no extra dependencies, and `site/src/rules.check.mjs` runs inside every dashboard build. |
| Evaluation | F | C | No measurement of detector accuracy before. The repo's own history (issue #3, PRs #1/#2/#4, commit `c4a929c`) is now a labelled replay: the check asserts the expected verdict for each attempt. Open: no labelled set of real accounts. |
| Reproducibility | D | B | Every `latest` dependency is pinned to the version already in `package-lock.json`; the dashboard uses exact pins and `npm ci`. GitHub metadata that git cannot hold is captured by a committed script with its date. |
| Security | C | B- | No secrets in the repo. The site's `npm audit` is clean (0 vulnerabilities). The dashboard makes no network calls on load. Open: root `npm audit` not reviewed in depth (Next app is not deployed). |
| Deployment | F | B | The live page loaded every asset from `/gitgenie/` while Pages serves `/GitGenie/`, so it rendered unstyled. `basePath` is fixed, `pages.yml` deploys the dashboard, and `deploy-pages.yml` no longer races it. |
| Docs | D | C+ | About 7.7k lines of plans across 14 markdown files promise features that do not exist. README now separates built from planned and links this review. |
| Limitations stated | F | B | The dashboard has a limitations window; this file lists open gaps. |

## Defects fixed in this change

Each is covered by a test in `tests/achievements.test.ts` and shown on the dashboard's engine audit.

1. **Pull Shark could never unlock.** `getGitHubPullRequests` uses `/search/issues`, whose items
   keep the merge time under `pull_request.merged_at`. The detector read `pr.merged_at`
   (`achievements.ts:90` at `97f0670`), which is always undefined. The recorded snapshot confirms the
   item shape (`site/data/github-snapshot.json`, `search_pr_item`).
2. **YOLO could never unlock.** It read `pr.review_comments === 0` (`achievements.ts:109`); search
   items have no such field, and review comments are not reviews. It now requires a known
   `review_count` of zero and never treats an unknown count as unreviewed.
3. **QuickDraw ignored time.** It unlocked on more than 5 closed issues (`achievements.ts:76`)
   although `created_at` and `closed_at` were fetched. It now compares close minus open with the
   300 s `timeLimit` in `constants.ts`. Issue #3 (closed 1 s after opening) now counts.
4. **StarStruck summed stars across repos** (`achievements.ts:165`); `constants.ts` says 16 stars on
   a repository. It now takes the best single repository.
5. **`getRateLimit` read `data.rate_limit`** (`github.ts:155`); the REST field is `data.rate`.

Also fixed: Pair Extraordinaire always returned locked; it now reads `Co-authored-by` trailers when
commits are supplied. `next.config.ts` basePath case. `package.json` `test` scripts pointed at an
uninstalled runner.

## What the repo's own history shows

From `git log` plus the snapshot recorded on 2026-11-07 (replayed live on the dashboard):

- **QuickDraw:** issue #3 closed 1 s after opening. Passes GitGenie's rule (300 s).
- **Pull Shark:** 3 PRs merged (#1, #4, #2 in merge order). Passes the rule (2) from the second merge.
  The original engine reported 0.
- **Pair Extraordinaire:** commit `c4a929c` carries one `Co-authored-by` trailer. Passes the rule.
- **YOLO:** PR #2 is titled "yolo" but had 3 reviews (one approval), so by GitGenie's own rule it is
  not an unreviewed merge. Every recorded PR had at least 2 reviews.
- **StarStruck:** 0 stars against 16.

These are verdicts under GitGenie's rules. Whether GitHub awarded any badge is not recorded in the
repo and is not claimed.

## Remaining gaps and exactly what each needs

| Gap | Why it is not fixed here | What it needs |
|---|---|---|
| Badge rules not grounded in a GitHub source | Thresholds and tiers are the project's own claims; no citation exists in the repo. | A cited source (GitHub docs or the GitHub achievements page) for each rule, recorded with a date in `constants.ts`. |
| YOLO cannot run end to end | Needs a review count per PR: one `/pulls/{n}/reviews` call per PR, up to 100 per user, above the 60/hour unauthenticated limit. | An authenticated GitHub token (OAuth sign-in, which the app plans but has not built) and a fetcher that adds `review_count`. |
| Pair Extraordinaire not fetched | Needs commit search for co-authored commits. | `/search/commits?q=author:<user>` with a token, then pass commits to `detectPairExtraordinaire`. |
| Galaxy Brain counts issues | Accepted discussion answers are only in the GraphQL API, which requires a token. | GraphQL query on `user.repositoryDiscussionComments(onlyAnswers: true)` with a token. |
| Heart On Your Sleeve undefined | Described three different ways (page, constants, engine). This is a product decision, not a code fix. | The owner picks one definition; then one detector and one test. |
| Public Sponsor always locked | Sponsorship status is GraphQL-only. | GraphQL `viewer.sponsoring` with a token. |
| Engine not wired to any page | All four app routes are "coming soon" stubs; wiring needs the sign-in flow. | Build `/dashboard` to call `detectAchievements` (client-side, unauthenticated first). |
| No accuracy evaluation beyond this repo | No labelled data. | A small labelled set (for example 20 consenting accounts with their visible badges), then precision and recall per badge. |
| Express API, Prisma, Redis, K8s are plans | Large build work, outside a review-sized change. | Implementation time; no special compute. |
| Icons differ between files (YOLO, Pair Extraordinaire) | Cosmetic; changing product copy is the owner's call. | Make `constants.ts` the only source and import it in `page.tsx` and `achievements.ts`. |
| Scratch files in repo root (`TemporaryReadme.txt`, `RepoInfo.txt`) | Not created by this change, so not deleted here. | Owner's go-ahead to remove them. |
| `NEXT_PUBLIC_GITHUB_OWNER` is the placeholder `yourusername` | Unused by any page today. | Set it when the app first reads it. |

## How to verify

```bash
npm test                                   # 7 engine smoke tests
cd site && npm ci && npm run build         # history extract, known-answer check, Vite build
node site/scripts/snapshot-github.mjs      # optional: refresh the recorded snapshot (free gh api calls)
```
