// The app ships as a static export (next.config output: 'export'), so the only routes that
// exist on GitHub Pages are the page.tsx files under app/. Every internal href must hit one.
// Run: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const files = (readdirSync('app', { recursive: true }) as string[]).filter((f) => f.endsWith('.tsx'))
// "(group)/dashboard/page.tsx" -> "/dashboard"; route groups do not appear in the URL
const routes = new Set(
  files
    .filter((f) => f.endsWith('page.tsx'))
    .map((f) => '/' + f.split('/').slice(0, -1).filter((s) => !s.startsWith('(')).join('/')),
)

test('every internal href points at an exported page', () => {
  const broken: string[] = []
  for (const f of files) {
    for (const [, href] of readFileSync(join('app', f), 'utf8').matchAll(/href="(\/[^"#?]*)/g)) {
      if (!routes.has(href)) broken.push(`app/${f}: ${href}`)
    }
  }
  assert.deepEqual(broken, [])
})
