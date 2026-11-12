// GET /api/player/:id — player bio for the player card, from the Highlightly
// API (/players/{id}). A bio (height, draft, birthplace…) hardly ever changes,
// so it's stored in Blobs and kept for 30 days. The API allows 100 requests a
// day, shared with the morning data-refresh, so bio fetches are capped per day
// (counted in Blobs); past the cap we serve the stored bio or "unavailable".
import { blobStore } from '../lib/store.mjs'
import { fetchPlayerBio } from '../../server/playerBio.js'

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000
const DAILY_CAP = 30
let known // player ids we have lines for (averages.json), per warm instance

const loadKnown = async store =>
  new Set(((await store.get('data/averages.json')) ?? []).map(p => String(p.id)))

export default async req => {
  const id = new URL(req.url).pathname.split('/').pop()
  if (!/^\d+$/.test(id)) return json({ error: 'bad id' }, 400)

  const store = blobStore()
  known ??= await loadKnown(store)
  // A player added by this morning's refresh may be newer than our list.
  if (!known.has(id)) known = await loadKnown(store)
  if (!known.has(id)) return json({ error: 'unknown player' }, 404)

  const key = `cache/players/${id}.json`
  const cached = await store.get(key)
  if (cached && Date.now() - cached.at < MAX_AGE_MS) return json(cached.bio)

  const countKey = `cache/bio-count/${new Date().toISOString().slice(0, 10)}.json`
  const count = (await store.get(countKey)) ?? 0
  if (count >= DAILY_CAP) return cached ? json(cached.bio) : json({ error: 'unavailable' }, 503)
  await store.set(countKey, count + 1)

  try {
    const bio = await fetchPlayerBio(id, process.env.HIGHLIGHTLY_API_KEY)
    await store.set(key, { at: Date.now(), bio })
    return json(bio)
  } catch (e) {
    console.warn(`player ${id}: ${e.message}`)
    return cached ? json(cached.bio) : json({ error: 'unavailable' }, 502)
  }
}

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json',
    'cache-control': 'public, max-age=0, must-revalidate',
    'netlify-cdn-cache-control': status === 200 ? 'public, durable, s-maxage=86400' : 'no-store',
  },
})

export const config = { path: '/api/player/:id' }
