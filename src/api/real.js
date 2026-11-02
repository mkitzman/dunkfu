// Reads the JSON files written by scripts/fetch-data.js (served from /data).

async function load(file) {
  const res = await fetch(`/data/${file}`)
  if (!res.ok) return null
  // Vite's dev server answers missing files with index.html, so check the type.
  if (!res.headers.get('content-type')?.includes('json')) return null
  return res.json()
}

export async function getGames(date) {
  return (await load(`games/${date}.json`)) ?? []
}

export async function getBoxscores(date) {
  const lines = (await load(`lines/${date}.json`)) ?? []
  return lines.map(({ to, ...p }) => ({ ...p, tov: to }))
}

let averages
export async function getAverages(teams) {
  averages ??= load('averages.json').then(a => a ?? [])
  const want = new Set(teams)
  return (await averages).filter(p => want.has(p.abbr))
}

export async function getGame(id) {
  return load(`box/${encodeURIComponent(id)}.json`)
}

export async function getAwards(date) {
  return load(`awards/${date}.json`)
}

export async function getStandings() {
  return (await load('standings.json'))?.rows ?? []
}
