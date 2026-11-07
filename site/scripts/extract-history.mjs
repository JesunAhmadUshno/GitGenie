// Build step: node scripts/extract-history.mjs  -> src/data/history.json
// Reads git log (needs full history, so CI checks out with fetch-depth 0) and quotes the
// detector lines exactly as they stood at ORIGINAL, the last main commit before the fixes.
// Co-author emails are dropped; only the public handle is kept.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const ORIGINAL = '97f0670';
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', cwd: new URL('..', import.meta.url) });

const SEP = '\x1f', END = '\x1e';
const commits = git('log', '--reverse', `--format=%H${SEP}%an${SEP}%aI${SEP}%P${SEP}%s${SEP}%b${END}`)
  .split(END).map((r) => r.trim()).filter(Boolean).map((r) => {
    const [hash, author, date, parents, subject, body] = r.split(SEP);
    const coauthors = [...body.matchAll(/^co-?authored-by:\s*([^<\n]+?)\s*</gim)].map((m) => m[1]);
    const pr = subject.match(/^Merge pull request #(\d+)/);
    return { hash: hash.slice(0, 7), author, date, merge: parents.split(' ').length > 1, subject, coauthors,
      ...(pr && { pr: +pr[1], prTitle: body.split('\n')[0].trim() }) };
  });

// Each quoted defect: file, a unique needle in the original source, and what it gets wrong.
const DEFECTS = [
  ['lib/services/achievements.ts', 'prs.filter((pr) => pr.merged_at)', 'pull_shark', 'Search items have no top-level merged_at, so Pull Shark counts 0 merges.'],
  ['lib/services/achievements.ts', 'pr.review_comments === 0', 'yolo', 'Search items have no review_comments, and review comments are not reviews, so YOLO never unlocks.'],
  ['lib/services/achievements.ts', 'closedIssues.length > 5', 'quick_draw', 'Counts closed issues and ignores created_at/closed_at, so a 1 s close does not count.'],
  ['lib/services/achievements.ts', 'sum + (repo.stargazers_count || 0)', 'startstruck', 'Sums stars across every repo; constants.ts asks for 16 on one repository.'],
  ['lib/services/github.ts', 'data.rate_limit.remaining', null, 'The /rate_limit response has data.rate, so this throws and returns null.'],
];
const defects = DEFECTS.map(([file, needle, badge, why]) => {
  const lines = git('show', `${ORIGINAL}:${file}`).split('\n');
  const i = lines.findIndex((l) => l.includes(needle));
  if (i < 0) throw new Error(`needle not found in ${ORIGINAL}:${file}: ${needle}`);
  return { file, line: i + 1, code: lines[i].trim(), badge, why };
});

fs.mkdirSync(new URL('../src/data/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../src/data/history.json', import.meta.url),
  JSON.stringify({ original: ORIGINAL, commits, defects }, null, 1) + '\n');
console.log(`history.json: ${commits.length} commits, ${defects.length} quoted defects`);
