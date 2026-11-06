// GET /data/<file>.json — serves the JSON written by data-refresh from Blobs.
// Locally, Vite serves the same paths from public/data instead.
import { blobStore } from '../lib/store.mjs'

export default async req => {
  const file = new URL(req.url).pathname.replace(/^\/data\//, '')
  if (!/^[\w-]+(\/[\w-]+)*\.json$/.test(file)) return new Response('Not found', { status: 404 })

  const data = await blobStore().get(`data/${file}`)
  if (!data) return new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } })

  // Data changes once a day; let the CDN hold it briefly.
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=0, must-revalidate',
      // Purged by data-refresh after each run; the short SWR window is a backstop.
      'netlify-cdn-cache-control': 'public, durable, s-maxage=600, stale-while-revalidate=300',
      'netlify-cache-tag': 'data',
    },
  })
}

export const config = { path: '/data/*' }
