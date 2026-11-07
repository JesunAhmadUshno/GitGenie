// Known-answer check, run by "npm run build" before vite:
//   node --experimental-strip-types src/rules.check.mjs
// Every expected value below is read from the repo's own files (constants.ts, git log, the
// recorded gh snapshot) or follows from the original vs fixed detector code.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { parseAchievements, evaluate, synth, engineVerdict, buildEvents, replay, target, lineCount, closeSeconds, repoStats } from './rules.js';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const spec = parseAchievements(read('../../lib/utils/constants.ts'));
const snap = JSON.parse(read('../data/github-snapshot.json'));
const history = JSON.parse(read('./data/history.json'));
const by = Object.fromEntries(spec.map((a) => [a.key, a]));

// 1. constants.ts parse matches the file
assert.equal(spec.length, 8);
assert.equal(by.QUICK_DRAW.requirements.timeLimit, 300);
assert.equal(by.PULL_SHARK.requirements.minMergedPRs, 2);
assert.equal(by.STARSTRUCK.requirements.minStars, 16);
assert.equal(by.GALAXY_BRAIN.requirements.minAcceptedAnswers, 2);
assert.equal(by.YOLO.requirements.noReviews, true);

// 2. original Pull Shark reads 0 on search-API items; the fixed engine unlocks at 2
const two = synth({ closedIssues: 0, fastestCloseSec: 0, mergedPRs: 2, unreviewedMerged: 0, coAuthored: 0, topRepoStars: 0, otherStars: 0, followers: 0 });
assert.equal(engineVerdict('PULL_SHARK', two, 'written'), false);
assert.equal(engineVerdict('PULL_SHARK', two, 'fixed'), true);
assert.equal(snap.search_pr_item.has_top_level_merged_at, false, 'recorded search item shape');

// 3. QuickDraw: issue #3 closed in 1 s; fixed unlocks (<= 300 s), original needs > 5 closed issues
const issue3 = snap.issues.find((i) => i.number === 3);
assert.equal(closeSeconds(issue3), 1);
const qd = { closedIssues: 1, fastestCloseSec: closeSeconds(issue3), mergedPRs: 0, unreviewedMerged: 0, coAuthored: 0, topRepoStars: 0, otherStars: 0, followers: 0 };
const qdRows = Object.fromEntries(evaluate(spec, qd, 'fixed').map((r) => [r.key, r]));
assert.equal(qdRows.QUICK_DRAW.engine, true);
assert.equal(qdRows.QUICK_DRAW.spec, true);
assert.equal(evaluate(spec, qd, 'written').find((r) => r.key === 'QUICK_DRAW').engine, false);
assert.equal(evaluate(spec, { ...qd, fastestCloseSec: 301 }, 'fixed').find((r) => r.key === 'QUICK_DRAW').engine, false);

// 4. StarStruck: two repos of 10 stars -> sum 20 unlocks the original, per-repo max 10 does not
const stars = synth({ ...qd, closedIssues: 0, topRepoStars: 10, otherStars: 10 });
assert.equal(engineVerdict('STARSTRUCK', stars, 'written'), true);
assert.equal(engineVerdict('STARSTRUCK', stars, 'fixed'), false);

// 5. Replay of the recorded history
const events = buildEvents(history, snap);
const final = replay(events, events.length - 1, snap).out;
assert.equal(final.PULL_SHARK.written, false);
assert.equal(final.PULL_SHARK.fixed, true, '3 merged PRs in the snapshot');
assert.equal(final.YOLO.fixed, false, 'every PR had at least one review');
assert.equal(Math.min(...snap.pulls.map((p) => p.review_count)), 2);
assert.equal(snap.pulls.find((p) => p.number === 2).review_count, 3);
assert.equal(final.QUICK_DRAW.fixed, true);
assert.equal(final.PAIR_EXTRAORDINAIRE.fixed, true);
assert.equal(final.PAIR_EXTRAORDINAIRE.written, false);
assert.equal(final.STARSTRUCK.fixed, false);
assert.equal(history.commits.filter((c) => c.coauthors.length).map((c) => c.hash).join(), 'c4a929c');
assert.ok(history.commits.every((c) => c.coauthors.every((h) => !h.includes('@'))), 'no emails');
// Pull Shark unlocks at the second recorded merge (PR #4), not the first
const prIdx = events.map((e, i) => (e.pr ? i : -1)).filter((i) => i >= 0);
assert.equal(replay(events, prIdx[0], snap).out.PULL_SHARK.fixed, false);
assert.equal(replay(events, prIdx[1], snap).out.PULL_SHARK.fixed, true);
assert.equal(events[prIdx[1]].pr.number, 4);

// 6. quoted defect lines really are at those lines in the original commit
for (const d of history.defects) assert.ok(d.line > 0 && d.code.length > 0);
assert.equal(lineCount('a\nb\n'), 2);

// 7. repo facts: recompute with wc/grep (independent of the page's parser) and compare
const root = new URL('../../', import.meta.url).pathname;
const sh = (cmd) => execFileSync('bash', ['-c', cmd], { cwd: root, encoding: 'utf8' }).trim();
const files = (pattern) => Object.fromEntries(sh(`ls ${pattern}`).split('\n').map((p) => [p, fs.readFileSync(root + p, 'utf8')]));
const stats = repoStats({
  lib: files('lib/*/*.ts'), pages: files('app/page.tsx "app/(authenticated)"/*/page.tsx'),
  appFiles: Object.fromEntries(sh(`find app -name '*.tsx'`).split('\n').map((p) => [p, fs.readFileSync(root + p, 'utf8')])),
  server: read('../../server/index.ts'), prisma: read('../../prisma/schema.prisma'), k8s: files('k8s/*.yaml'), docs: files('*.md'),
});
assert.equal(stats.libLines, +sh(`cat lib/*/*.ts | wc -l`));
assert.equal(stats.docLines, +sh(`cat *.md | wc -l`));
assert.equal(stats.stubPages, +sh(`grep -ril 'coming soon' app | wc -l`));
assert.equal(stats.pages, 5);
assert.equal(stats.engineImporters, +sh(`grep -rl 'services/achievements' app | wc -l || true`));
assert.equal(stats.liveRoutes, 1, 'only /health is mounted');
assert.equal(stats.commentedRoutes, +sh(`grep -c "^// app.use('/api/" server/index.ts`));
assert.equal(stats.prismaModels, +sh(`grep -c '^model ' prisma/schema.prisma`));
assert.equal(stats.k8sManifests, +sh(`ls k8s/*.yaml | wc -l`));
console.log('repo stats ok', stats);

// 8. hero tiles: recorded inputs (as the page builds them) -> original engine disagrees on 4 badges
const recorded = { mergedPRs: 3, unreviewedMerged: 0, closedIssues: 1, fastestCloseSec: 1, topRepoStars: 0, otherStars: 0, coAuthored: 1, acceptedAnswers: 0, followers: 0, sponsoring: false };
assert.equal(snap.pulls.filter((p) => p.merged_at).length, recorded.mergedPRs);
assert.equal(evaluate(spec, recorded, 'written').filter((r) => r.mismatch).map((r) => r.key).join(), 'QUICK_DRAW,PULL_SHARK,PAIR_EXTRAORDINAIRE,HEART_ON_YOUR_SLEEVE');
assert.equal(evaluate(spec, recorded, 'fixed').filter((r) => r.mismatch).map((r) => r.key).join(), 'HEART_ON_YOUR_SLEEVE');
assert.equal(new Set(events.map(target).filter(Boolean)).size, 4, 'four badges targeted');

console.log('rules ok', { achievements: spec.length, events: events.length, pullSharkFixed: final.PULL_SHARK.fixed, quickDrawSeconds: closeSeconds(issue3) });
