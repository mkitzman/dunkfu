// Data shaping for the player card (game log, averages, awards, vitals).
import { AWARD_TYPES } from '../data/awards.js'
import { fantasyPoints } from '../data/fantasy.js'
import { todayNY } from '../utils.js'

const r1 = n => Math.round(n * 10) / 10
const fmt = (iso, opts) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', ...opts })

export function seasonLabel(today = todayNY()) {
  const [y, m] = today.split('-').map(Number)
  const start = m >= 10 ? y : y - 1
  return `${start}–${String(start + 1).slice(2)}`
}

export const COUNT_STATS = ['min', 'pts', 'reb', 'ast', 'stl', 'blk', 'to', 'pm']

// Season numbers from a player's game log (games he actually played).
export function summarize(player) {
  const games = (player?.games ?? []).map(g => (g.min > 0 ? { ...g, fpts: fantasyPoints(g) } : g))
  const played = games.filter(g => g.min > 0)
  const n = played.length || 1
  const sum = k => played.reduce((s, g) => s + (g[k] ?? 0), 0)
  const avg = Object.fromEntries([...COUNT_STATS, 'fpts'].map(k => [k, r1(sum(k) / n)]))
  const pct = (m, a) => (sum(a) ? r1((100 * sum(m)) / sum(a)) : null)
  avg.fgPct = pct('fgm', 'fga'); avg.tpPct = pct('tpm', 'tpa'); avg.ftPct = pct('ftm', 'fta')

  // Every award type, in order, with its count and the dates earned.
  const awards = AWARD_TYPES.map(t => {
    const dates = games.filter(g => g.awards?.includes(t.key)).map(g => g.date)
    return { ...t, count: dates.length, dates }
  })
  return { games, played, gp: played.length, avg, awards, totalAwards: awards.reduce((s, a) => s + a.count, 0) }
}

// Heat shading against his own average: -1..1 (TO reversed), null if ~average.
export function heat(v, avg, invert = false) {
  if (v == null || avg == null) return null
  let x = (v - avg) / Math.max(1.2, avg * 0.35)
  if (invert) x = -x
  x = Math.max(-1, Math.min(1, x))
  return Math.abs(x) * 0.5 < 0.07 ? null : x
}

export const shortDate = iso => fmt(iso, { month: 'short', day: 'numeric' }) // Nov 10
export const slashDate = iso => fmt(iso, { month: 'numeric', day: 'numeric' }) // 11/10
export const weekdayShort = iso => fmt(iso, { weekday: 'short' }) // Tue

// Vitals rows from the API bio (falls back to what the lines know).
export function vitals(bio, player, today = todayNY()) {
  const rows = []
  const pos = bio?.positionAbbr || player?.pos
  rows.push({ label: 'Position', value: bio?.position && pos ? pos : pos || '—', sub: bio?.position && bio.position !== pos ? bio.position : '' })

  const hm = /(\d+)\D+(\d+)/.exec(bio?.height ?? '')
  const lb = /(\d+)/.exec(bio?.weight ?? '')?.[1]
  if (hm || lb) {
    const ft = hm ? `${hm[1]}-${hm[2]}` : null
    const cm = hm ? Math.round((+hm[1] * 12 + +hm[2]) * 2.54) : null
    const kg = lb ? Math.round(+lb * 0.4536) : null
    rows.push({
      label: 'Height / weight',
      value: [ft, lb && `${lb} lb`].filter(Boolean).join(' · '),
      sub: [cm && `${cm} cm`, kg && `${kg} kg`].filter(Boolean).join(' · '),
    })
  }

  const bm = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(bio?.birthDate ?? '')
  if (bm) {
    const iso = `${bm[3]}-${bm[2]}-${bm[1]}`
    const [ty, tm, td] = today.split('-').map(Number)
    let age = ty - +bm[3]
    if (tm < +bm[2] || (tm === +bm[2] && td < +bm[1])) age--
    rows.push({ label: 'Born', value: fmt(iso, { month: 'short', day: 'numeric', year: 'numeric' }), sub: `Age ${age}` })
  }
  if (bio?.birthPlace) rows.push({ label: 'Birthplace', value: bio.birthPlace, sub: '' })
  if (bio) {
    const d = bio.draft
    rows.push({ label: 'Draft', value: d ? `${d.year} · Rd ${d.round} · Pick ${d.pick}` : 'Undrafted', sub: '' })
  }
  return rows
}
