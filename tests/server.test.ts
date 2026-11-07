// Boots the Express backend (server/index.ts) in a child process and checks its routes.
// Run: npm test
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { spawn, type ChildProcess } from 'node:child_process'

const PORT = 3917
const base = `http://localhost:${PORT}`
let server: ChildProcess

before(async () => {
  server = spawn('node_modules/.bin/tsx', ['server/index.ts'], {
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'test' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  await new Promise<void>((resolve, reject) => {
    const onData = (chunk: Buffer) => {
      output += chunk
      if (output.includes('Server running')) resolve()
    }
    server.stdout!.on('data', onData)
    server.stderr!.on('data', onData)
    server.on('exit', (code) => reject(new Error(`server exited (${code}) before listening:\n${output}`)))
    setTimeout(() => reject(new Error(`server did not start in 15s:\n${output}`)), 15000).unref()
  })
})

after(() => server?.kill())

test('GET /health returns OK', async () => {
  const res = await fetch(`${base}/health`)
  assert.equal(res.status, 200)
  assert.equal((await res.json()).status, 'OK')
})
