// Local data refresh: runs the same pipeline as the Netlify scheduled function,
// but stores everything as files.
//
//   npm run fetch-data
//
//   public/data/   what the site reads (override with DATA_DIR)
//   data/cache/    raw API responses that can't change
//   data/history/  daily standings snapshots (last night's seed change)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { refresh } from '../server/pipeline.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.resolve(ROOT, process.env.DATA_DIR || 'public/data')

const file = key => (key.startsWith('data/') ? path.join(OUT, key.slice(5)) : path.join(ROOT, 'data', key))

const store = {
  async get(key) {
    const f = file(key)
    return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null
  },
  async set(key, value) {
    const f = file(key)
    fs.mkdirSync(path.dirname(f), { recursive: true })
    fs.writeFileSync(f, JSON.stringify(value))
  },
  // Keys starting with prefix (prefix is a directory plus optional filename start).
  async list(prefix) {
    const i = prefix.lastIndexOf('/')
    const dir = prefix.slice(0, i + 1), start = prefix.slice(i + 1)
    const d = file(dir)
    if (!fs.existsSync(d)) return []
    return fs.readdirSync(d).filter(n => n.startsWith(start) && n.endsWith('.json')).map(n => dir + n)
  },
}

try {
  await refresh({ store, key: process.env.HIGHLIGHTLY_API_KEY })
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
