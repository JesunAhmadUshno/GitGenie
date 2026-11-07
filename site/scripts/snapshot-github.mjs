// One-off recorder: node scripts/snapshot-github.mjs  (needs the gh CLI, free REST calls).
// Writes data/github-snapshot.json with the PR, issue and star metadata that git log
// cannot show. The site labels this file RECORDED with its capture date; rerun to refresh.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const REPO = 'JesunAhmadUshno/GitGenie';
const api = (path) => JSON.parse(execFileSync('gh', ['api', path], { encoding: 'utf8' }));

const pulls = [1, 2, 4].map((n) => {
  const pr = api(`repos/${REPO}/pulls/${n}`);
  const reviews = api(`repos/${REPO}/pulls/${n}/reviews`);
  return {
    number: pr.number, head: pr.head.ref, // titles come from the merge commits in git log
    created_at: pr.created_at, merged_at: pr.merged_at, commits: pr.commits,
    review_count: reviews.length, review_states: reviews.map((r) => r.state),
    review_comments: pr.review_comments,
  };
});
const issue = api(`repos/${REPO}/issues/3`);
const repo = api(`repos/${REPO}`);
const search = api(`search/issues?q=repo:${REPO}+type:pr&per_page=1`);
const item = search.items[0] ?? {};

const out = {
  captured_at: new Date().toISOString(),
  source: `gh api (GitHub REST v3) for ${REPO}`,
  pulls,
  issues: [{ number: issue.number, created_at: issue.created_at, closed_at: issue.closed_at }],
  repo: { stargazers_count: repo.stargazers_count, forks_count: repo.forks_count },
  search_pr_item: {
    has_top_level_merged_at: 'merged_at' in item,
    has_review_comments: 'review_comments' in item,
    has_pull_request_merged_at: Boolean(item.pull_request && 'merged_at' in item.pull_request),
  },
};
fs.writeFileSync(new URL('../data/github-snapshot.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log('wrote data/github-snapshot.json', out.captured_at);
