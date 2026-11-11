// GET /data/<file>.json — serves the JSON written by data-refresh from Blobs.
// Locally, Vite serves the same paths from public/data instead.
import { blobStore } from '../lib/store.mjs'

export default async req => {
  const file = new URL(req.url).pathname.replace(/^\/data\//, '')
  if (!/^[\w-]+(\/[\w-]+)*\.json$/.test(file)) return new Response('Not found', { status: 404 })

  const data = await blobStore().get(`data/${file}`)
  if (!data) return new Response('Not found', { status: 404, headers: { 'cache-control': 'no-store' } })

  // Data changes once a day and data-refresh purges the whole CDN cache after
  // each run, so the CDN can hold everything; visitors (often just one) then
  // never wait on this function and its cold starts. Browsers revalidate
  // with the CDN on every visit (max-age=0), which is fast.
  //
  // meta.json is the version the client stamps on every other request
  // (?v=). Short CDN life, but served stale while it refreshes in the
  // background, so even a missed purge only lags one visit.
  // Everything else is requested with ?v=<updatedAt>: a new run means new
  // URLs, so a year is safe.
  const cdn = file === 'meta.json'
    ? 'public, durable, s-maxage=300, stale-while-revalidate=86400'
    : 'public, durable, s-maxage=31536000'
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=0, must-revalidate',
      'netlify-cdn-cache-control': cdn,
      'netlify-cache-tag': 'data',
    },
  })
}

export const config = { path: '/data/*' }
