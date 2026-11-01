// The pipeline's store interface (see server/pipeline.js) backed by Netlify Blobs.
import { getStore } from '@netlify/blobs'

export function blobStore() {
  const s = getStore('dunkfu')
  return {
    get: key => s.get(key, { type: 'json' }),
    set: (key, value) => s.setJSON(key, value),
    list: async prefix => (await s.list({ prefix })).blobs.map(b => b.key),
  }
}
