// Static checks that Dockerfile.frontend and Dockerfile.backend can build from this repo,
// plus a boot test of the file the backend image runs. Run: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, globSync, readFileSync } from 'node:fs'
import { execFileSync, spawn } from 'node:child_process'

const dockerfiles = ['Dockerfile.frontend', 'Dockerfile.backend']
const read = (p: string) => readFileSync(p, 'utf8')
const pkg = JSON.parse(read('package.json'))
const ignored = read('.dockerignore').split('\n').map((l) => l.trim())
const exported = /output:\s*'export'/.test(read('next.config.ts'))
// The file `npm run server:build` writes (its --outfile)
const serverOut = /--outfile=(\S+)/.exec(pkg.scripts['server:build'])?.[1]

for (const file of dockerfiles) {
  const lines = read(file).split('\n').map((l) => l.trim())

  test(`${file}: node base image meets Next's engine range`, () => {
    const min = +JSON.parse(read('node_modules/next/package.json')).engines.node.match(/\d+/)[0]
    for (const l of lines.filter((l) => /^FROM node:/.test(l))) {
      assert.ok(+l.match(/^FROM node:(\d+)/)![1] >= min, `${l} is below Node ${min}`)
    }
  })

  test(`${file}: npm ci has its lockfile in the build context`, () => {
    if (lines.some((l) => l.includes('npm ci'))) assert.ok(!ignored.includes('package-lock.json'))
  })

  test(`${file}: every COPY source exists in the context or is a builder output`, () => {
    const missing: string[] = []
    for (const l of lines.filter((l) => l.startsWith('COPY '))) {
      const parts = l.split(/\s+/).slice(1)
      const from = parts.find((p) => p.startsWith('--from='))
      const srcs = parts.filter((p) => !p.startsWith('--')).slice(0, -1)
      for (const src of srcs) {
        if (!from) {
          if (src !== '.' && globSync(src).length === 0) missing.push(src)
        } else {
          const rel = src.replace(/^\/app\//, '')
          const built = (exported && rel === 'out') || rel === serverOut || rel === 'node_modules'
          if (!built && !existsSync(rel)) missing.push(`${from} ${src}`)
        }
      }
    }
    assert.deepEqual(missing, [])
  })
}

test('Dockerfile.backend CMD runs the file server:build writes, and it serves /health', async () => {
  const cmd = read('Dockerfile.backend').match(/^CMD \["node", "([^"]+)"\]/m)
  assert.ok(cmd, 'backend CMD is node <file>')
  assert.equal(cmd[1], serverOut)
  execFileSync('npm', ['run', 'server:build'], { stdio: 'ignore' })
  const port = 3000 + Math.floor(Math.random() * 20000) + 20000
  const child = spawn('node', [cmd[1]], { env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] })
  try {
    await new Promise<void>((resolve, reject) => {
      let out = ''
      const onData = (c: Buffer) => ((out += c), out.includes('Server running') && resolve())
      child.stdout!.on('data', onData)
      child.stderr!.on('data', onData)
      child.on('exit', (code) => reject(new Error(`exited ${code}: ${out}`)))
      setTimeout(() => reject(new Error(`no start: ${out}`)), 15000).unref()
    })
    const res = await fetch(`http://localhost:${port}/health`)
    assert.equal(res.status, 200)
  } finally {
    child.kill()
  }
})
