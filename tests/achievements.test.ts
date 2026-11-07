// Smoke tests for the achievement detectors and the GitHub client.
// Run: npm test (node --test with type stripping, no extra dependencies).
// Fixtures use the shape GitHub's /search/issues endpoint returns: a pull request item
// carries its merge time under pull_request.merged_at, not at the top level.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  detectQuickDraw,
  detectPullShark,
  detectYOLO,
  detectStarStruck,
  detectPairExtraordinaire,
} from '../lib/services/achievements.ts'
import { getRateLimit } from '../lib/services/github.ts'
import { ACHIEVEMENTS } from '../lib/utils/constants.ts'

const mergedSearchItem = (mergedAt: string, extra = {}) => ({
  number: 1,
  created_at: '2026-03-01T20:49:01Z',
  pull_request: { merged_at: mergedAt },
  ...extra,
})

test('constants define the 8 achievements the site catalogues', () => {
  assert.equal(Object.keys(ACHIEVEMENTS).length, 8)
  assert.equal(ACHIEVEMENTS.PULL_SHARK.requirements.minMergedPRs, 2)
})

test('Pull Shark counts merges from search-API items (pull_request.merged_at)', () => {
  const prs = [mergedSearchItem('2026-03-01T20:49:09Z'), mergedSearchItem('2026-03-01T21:11:47Z')]
  assert.equal(detectPullShark(prs).unlocked, true)
  assert.equal(detectPullShark(prs.slice(0, 1)).unlocked, false)
})

test('QuickDraw uses the open-to-close time against the 300 s limit', () => {
  const fast = { created_at: '2026-03-01T20:51:12Z', closed_at: '2026-03-01T20:51:13Z' }
  const slow = { created_at: '2026-03-01T20:51:12Z', closed_at: '2026-03-01T21:01:12Z' }
  assert.equal(detectQuickDraw([fast]).unlocked, true)
  assert.equal(detectQuickDraw([slow, slow, slow, slow, slow, slow]).unlocked, false)
})

test('StarStruck needs 16 stars on one repository, not summed across repos', () => {
  assert.equal(detectStarStruck([{ stargazers_count: 10 }, { stargazers_count: 10 }]).unlocked, false)
  assert.equal(detectStarStruck([{ stargazers_count: 16 }]).unlocked, true)
})

test('YOLO needs a merged PR with a known review count of zero', () => {
  const at = '2026-03-01T20:49:09Z'
  assert.equal(detectYOLO([mergedSearchItem(at, { review_count: 0 })]).unlocked, true)
  assert.equal(detectYOLO([mergedSearchItem(at, { review_count: 3 })]).unlocked, false)
  assert.equal(detectYOLO([mergedSearchItem(at)]).unlocked, false)
})

test('Pair Extraordinaire reads co-author trailers when commits are supplied', () => {
  const trailer = ['Co', 'authored-by'].join('-') // the git trailer key
  const msg = `feat: pair\n\n${trailer}: someone <someone@users.noreply.github.com>`
  assert.equal(detectPairExtraordinaire([{ commit: { message: msg } }]).unlocked, true)
  assert.equal(detectPairExtraordinaire([{ commit: { message: 'feat: solo' } }]).unlocked, false)
})

test('getRateLimit reads the REST "rate" field', async () => {
  const realFetch = globalThis.fetch
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ resources: {}, rate: { remaining: 42, reset: 7 } }))) as typeof fetch
  try {
    assert.deepEqual(await getRateLimit(), { remaining: 42, reset: 7 })
  } finally {
    globalThis.fetch = realFetch
  }
})
