// Boots the Express backend (server/index.ts) in a child process and checks its routes.
// Run: npm test
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { spawn, type ChildProcess } from 'node:child_process'
import { createServer } from 'node:net'

let base = ''
let server: ChildProcess

// Ask the OS for a free port so a server already running on a fixed port cannot answer for us.
const freePort = () =>
  new Promise<number>((resolve) => {
    const probe = createServer().listen(0, () => {
      const { port } = probe.address() as { port: number }
      probe.close(() => resolve(port))
    })
  })

before(async () => {
  const PORT = await freePort()
  base = `http://localhost:${PORT}`
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

test('unknown routes return the 404 JSON, not a 500', async () => {
  const res = await fetch(`${base}/nope`)
  assert.equal(res.status, 404)
  assert.deepEqual(await res.json(), { success: false, error: 'Route not found' })
})
