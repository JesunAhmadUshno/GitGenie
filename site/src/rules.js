// Badge rule engine for the dashboard. Pure functions, shared by the page and rules.check.mjs.
// "fixed" runs the repo's own detectors (lib/services/achievements.ts, imported directly).
// "written" is a line-for-line JS port of the same detectors at commit 97f0670, before the fixes.
import * as fixed from '../../lib/services/achievements.ts';

// ---- spec: parse lib/utils/constants.ts so the catalogue cannot drift from the repo ----
export function parseAchievements(src) {
  const body = src.slice(src.indexOf('export const ACHIEVEMENTS'), src.indexOf('} as const'));
  const out = [];
  for (const m of body.matchAll(/^ {2}([A-Z_]+): \{\n([\s\S]*?)\n {2}\},?$/gm)) {
    const block = m[2];
    const str = (k) => block.match(new RegExp(`${k}: '([^']*)'`))?.[1];
    const reqSrc = block.match(/requirements: \{([\s\S]*?)\}/)[1];
    const requirements = {};
    for (const [, k, v] of reqSrc.matchAll(/(\w+): ([^,\n]+),/g)) {
      const t = v.trim();
      requirements[k] = t === 'true' ? true : t === 'false' ? false : /^\d+$/.test(t) ? +t : t.replace(/'/g, '');
    }
    out.push({ key: m[1], id: str('id'), name: str('name'), description: str('description'), icon: str('icon'), color: str('color'), requirements });
  }
  return out;
}

// ---- the original detectors (97f0670), ported verbatim in logic ----
const written = {
  quick_draw: (issues) => issues.filter((i) => i.closed_at).length > 5,
  pull_shark: (prs) => prs.filter((pr) => pr.merged_at).length >= 2,
  yolo: (prs) => prs.filter((pr) => pr.merged_at && pr.review_comments === 0).length >= 1,
  pair_extraordinaire: () => false,
  galaxy_brain: (issues) => issues.length >= 2,
  startstruck: (repos) => repos.reduce((s, r) => s + (r.stargazers_count || 0), 0) >= 16,
  public_sponsor: () => false,
  heart_on_your_sleeve: (followers) => followers.length > 0,
};
const current = {
  quick_draw: (d) => fixed.detectQuickDraw(d).unlocked,
  pull_shark: (d) => fixed.detectPullShark(d).unlocked,
  yolo: (d) => fixed.detectYOLO(d).unlocked,
  pair_extraordinaire: (d) => fixed.detectPairExtraordinaire(d).unlocked,
  galaxy_brain: (d) => fixed.detectGalaxyBrain(d).unlocked,
  startstruck: (d) => fixed.detectStarStruck(d).unlocked,
  public_sponsor: (d) => fixed.detectPublicSponsor(d).unlocked,
  heart_on_your_sleeve: (d) => fixed.detectHeartOnYourSleeve(d).unlocked,
};

// constants.ts key -> engine id and which slice of the fetched data the engine is given
export const ENGINE = {
  QUICK_DRAW: ['quick_draw', 'issues'], PULL_SHARK: ['pull_shark', 'prs'], YOLO: ['yolo', 'prs'],
  PAIR_EXTRAORDINAIRE: ['pair_extraordinaire', 'commits'], GALAXY_BRAIN: ['galaxy_brain', 'issues'],
  STARSTRUCK: ['startstruck', 'repos'], PUBLIC_SPONSOR: ['public_sponsor', 'user'], HEART_ON_YOUR_SLEEVE: ['heart_on_your_sleeve', 'followers'],
};

// What constants.ts says, applied to plain counts. null = the repo gives no checkable rule.
export function specVerdict(key, req, c) {
  switch (key) {
    case 'QUICK_DRAW': return c.closedIssues > 0 && c.fastestCloseSec <= req.timeLimit;
    case 'PULL_SHARK': return c.mergedPRs >= req.minMergedPRs;
    case 'YOLO': return req.noReviews === true && c.unreviewedMerged >= 1;
    case 'PAIR_EXTRAORDINAIRE': return c.coAuthored >= req.minCoAuthors;
    case 'GALAXY_BRAIN': return c.acceptedAnswers >= req.minAcceptedAnswers;
    case 'STARSTRUCK': return c.topRepoStars >= req.minStars;
    case 'PUBLIC_SPONSOR': return c.sponsoring === req.activeSponsorship;
    default: return null; // HEART_ON_YOUR_SLEEVE: described three different ways in the repo
  }
}

// Turn counts into the shapes GitHub returns: /search/issues items for PRs and issues.
export function synth(c, t0 = Date.parse('2026-03-01T20:00:00Z')) {
  const iso = (s) => new Date(t0 + s * 1000).toISOString();
  const issues = Array.from({ length: c.closedIssues }, (_, i) => ({ created_at: iso(0), closed_at: iso(i === 0 ? c.fastestCloseSec : 86400) }));
  const prs = Array.from({ length: c.mergedPRs }, (_, i) => ({ created_at: iso(0), pull_request: { merged_at: iso(60) }, review_count: i < c.unreviewedMerged ? 0 : 1 }));
  const commits = Array.from({ length: c.coAuthored }, () => ({ commit: { message: `feat: x\n\n${TRAILER}: someone <x>` } }));
  return { issues, prs, commits, repos: [{ stargazers_count: c.topRepoStars }, { stargazers_count: c.otherStars }], followers: Array(c.followers).fill({}), user: {} };
}

export function engineVerdict(key, data, mode) {
  const [id, slice] = ENGINE[key];
  return mode === 'written' ? written[id](data[slice]) : current[id](data[slice]);
}

export function evaluate(spec, counts, mode) {
  const data = synth(counts);
  return spec.map((a) => {
    const s = specVerdict(a.key, a.requirements, counts);
    const e = engineVerdict(a.key, data, mode);
    return { ...a, spec: s, engine: e, mismatch: s === null || s !== e };
  });
}

// Replay recorded events (git log + gh snapshot) in time order, cumulatively.
const TRAILER = ['Co', 'authored-by'].join('-'); // the git trailer key
const prTitle = (history, n) => history.commits.find((c) => c.pr === n)?.prTitle ?? `PR #${n}`;

export function buildEvents(history, snapshot) {
  const ev = history.commits.map((c) => ({ kind: c.coauthors.length ? 'pair' : c.merge ? 'merge' : 'commit', at: c.date, label: c.hash, title: c.subject, commit: c }));
  for (const p of snapshot.pulls) ev.push({ kind: 'pr', at: p.merged_at, label: `PR #${p.number}`, title: prTitle(history, p.number), pr: p });
  for (const i of snapshot.issues) ev.push({ kind: 'issue', at: i.closed_at, label: `#${i.number}`, title: "issue opened and closed", issue: i });
  return ev.sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}

export function target(e) {
  if (e.kind === 'issue') return 'QUICK_DRAW';
  if (e.kind === 'pr') return /yolo/i.test(e.title) ? 'YOLO' : 'PULL_SHARK';
  if (e.kind === 'pair') return 'PAIR_EXTRAORDINAIRE';
  return null;
}

export function replay(events, upto, snapshot) {
  const seen = events.slice(0, upto + 1);
  const data = {
    issues: seen.filter((e) => e.issue).map((e) => ({ created_at: e.issue.created_at, closed_at: e.issue.closed_at })),
    prs: seen.filter((e) => e.pr).map((e) => ({ created_at: e.pr.created_at, pull_request: { merged_at: e.pr.merged_at }, review_count: e.pr.review_count })),
    commits: seen.filter((e) => e.commit).map((e) => ({ commit: { message: e.commit.coauthors.map((h) => `${TRAILER}: ${h} <x>`).join('\n') } })),
    repos: [{ stargazers_count: snapshot.repo.stargazers_count }], followers: [], user: {},
  };
  const out = {};
  for (const key of Object.keys(ENGINE)) out[key] = { written: engineVerdict(key, data, 'written'), fixed: engineVerdict(key, data, 'fixed') };
  return { data, out };
}

export const lineCount = (src) => src.split('\n').length - (src.endsWith('\n') ? 1 : 0);
export const closeSeconds = (i) => (Date.parse(i.closed_at) - Date.parse(i.created_at)) / 1000;

// Repo facts for the overview and architecture windows. Each argument maps path -> source text.
export function repoStats({ lib, pages, appFiles, server, prisma, k8s, docs }) {
  const sum = (m) => Object.values(m).reduce((s, src) => s + lineCount(src), 0);
  const stubs = Object.entries(pages).filter(([, src]) => /coming soon/i.test(src));
  return {
    libFiles: Object.keys(lib).length,
    libLines: sum(lib),
    pages: Object.keys(pages).length,
    stubPages: stubs.length,
    stubNames: stubs.map(([p]) => p.split('/').slice(-2, -1)[0]),
    engineImporters: Object.values(appFiles).filter((src) => /services\/achievements/.test(src)).length,
    liveRoutes: (server.match(/^app\.(get|post|put|delete|use)\('\/(?!api\/'\s*,\s*limiter)/gm) || []).length,
    commentedRoutes: (server.match(/^\/\/ app\.use\('\/api\//gm) || []).length,
    prismaModels: (prisma.match(/^model \w+/gm) || []).length,
    k8sManifests: Object.keys(k8s).length,
    docFiles: Object.keys(docs).length,
    docLines: sum(docs),
  };
}
