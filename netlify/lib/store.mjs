// The pipeline's store interface (see server/pipeline.js) backed by Netlify Blobs.
import { getStore } from '@netlify/blobs'

export function blobStore() {
  // Strong consistency: each run reads back what it just wrote (player lines →
  // awards/averages). The default eventual mode can return the previous value
  // for up to a minute, which left last night's awards empty.
  const s = getStore({ name: 'dunkfu', consistency: 'strong' })
  return {
    get: key => s.get(key, { type: 'json' }),
    set: (key, value) => s.setJSON(key, value),
    list: async prefix => (await s.list({ prefix })).blobs.map(b => b.key),
  }
}
