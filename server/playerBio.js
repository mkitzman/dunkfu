// Player bio from the Highlightly API (/players/{id}), trimmed to what the
// player card shows. Shared by the Netlify function and the Vite dev server.
const API = 'https://nba.highlightly.net'

export async function fetchPlayerBio(id, key) {
  if (!key) throw new Error('no API key')
  const res = await fetch(`${API}/players/${id}`, { headers: { 'x-rapidapi-key': key } })
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 120)}`)
  const body = await res.json()
  const p = (Array.isArray(body) ? body[0] : body?.data?.[0] ?? body) ?? {}
  const pr = p.profile ?? {}
  return {
    id: Number(id),
    name: p.fullName ?? pr.fullName ?? null,
    position: pr.position?.main ?? null,
    positionAbbr: pr.position?.abbreviation ?? null,
    height: pr.height ?? null, // e.g. 6' 10"
    weight: pr.weight ?? null, // e.g. 265 lbs
    birthDate: pr.birthDate ?? null, // DD.MM.YYYY
    birthPlace: pr.birthPlace ?? null,
    jersey: pr.jersey ?? null,
    draft: pr.draft?.year ? { year: pr.draft.year, round: pr.draft.round, pick: pr.draft.pick } : null,
    team: pr.team?.abbreviation ?? null,
  }
}
