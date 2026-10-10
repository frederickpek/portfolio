import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from './lib/load-env.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

loadEnv(root)

function run(script) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(__dirname, script)], {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    })
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`)),
    )
  })
}

await run('fetch-projects.mjs')
await run('prefetch-activity.mjs')
