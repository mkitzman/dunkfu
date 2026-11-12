// GET /api/player/:id?gp=N — player bio for the player card, from the
// Highlightly API (/players/{id}). Stored in Blobs with the games-played count
// it was fetched at, and only refetched once the player has played again
// (`gp` grew) and at most every 6 hours, so it costs about one API request
// per player per game, and only for players someone opens.
import { blobStore } from '../lib/store.mjs'
import { fetchPlayerBio } from '../../server/playerBio.js'

const MIN_AGE_MS = 6 * 60 * 60 * 1000
let known // player ids we have lines for (averages.json), per warm instance

export default async req => {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()
  const gp = Number(url.searchParams.get('gp')) || 0
  if (!/^\d+$/.test(id)) return json({ error: 'bad id' }, 400)

  const store = blobStore()
  known ??= new Set(((await store.get('data/averages.json')) ?? []).map(p => String(p.id)))
  if (!known.has(id)) return json({ error: 'unknown player' }, 404)

  const key = `cache/players/${id}.json`
  const cached = await store.get(key)
  const fresh = cached && (cached.gp >= gp || Date.now() - cached.at < MIN_AGE_MS)
  if (fresh) return json(cached.bio)

  try {
    const bio = await fetchPlayerBio(id, process.env.HIGHLIGHTLY_API_KEY)
    await store.set(key, { gp, at: Date.now(), bio })
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
    // The URL carries gp, so a cached copy is right until his next game.
    'cache-control': 'public, max-age=0, must-revalidate',
    'netlify-cdn-cache-control': status === 200 ? 'public, durable, s-maxage=86400' : 'no-store',
  },
})

export const config = { path: '/api/player/:id' }
