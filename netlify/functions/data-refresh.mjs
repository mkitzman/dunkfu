// Scheduled: pull last night's games, box scores and standings into Blobs.
// 10:00 UTC is 6 AM Eastern (5 AM in winter), after West Coast games finish.
// Scheduled functions get ~30s. New API requests stop at 15s, leaving time to
// save everything; the next run continues any backlog.
import { refresh } from '../../server/pipeline.js'
import { blobStore } from '../lib/store.mjs'

export default async () => {
  await refresh({
    store: blobStore(),
    key: process.env.HIGHLIGHTLY_API_KEY,
    deadline: Date.now() + 15_000,
  })
}

export const config = { schedule: '0 10 * * *' }
