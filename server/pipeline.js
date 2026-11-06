// Pulls NBA data from Highlightly and writes the JSON the site reads.
//
// Storage is pluggable so the same code runs locally (files on disk, see
// scripts/fetch-data.js) and on Netlify (Blobs, see netlify/functions). A store
// needs get(key) -> object|null, set(key, object), and list(prefix) -> keys.
//
// Keys:
//   data/...     what the site reads (games/DATE, box/ID, lines/DATE, awards/DATE, averages, standings, meta)
//   cache/...    raw API responses that can't change (settled days, box scores, lineups)
//   history/...  daily standings snapshots for the 7-day seed change
//
// The free plan allows 100 requests a day. A run stops before the limit (or a
// time budget) and the next run picks up where it left off; finished games are
// only ever downloaded once.

import TEAMS from '../src/data/teams.json' with { type: 'json' }
import { computeAwards, VERSION as AWARDS_VERSION } from './awards.js'

const API = 'https://nba.highlightly.net'
const TZ = 'America/New_York'
const RESERVE = 5 // requests left untouched at the end of a run
const DONE = new Set(['Finished', 'Postponed', 'Cancelled', 'Canceled', 'Abandoned'])

const STAT = {
  'Total Minutes Played': 'min', 'Total Points Scored': 'pts',
  'Successful Field Goals': 'fgm', 'Total Field Goals': 'fga',
  'Successful 3PT Field Goals': 'tpm', 'Total 3PT Field Goals': 'tpa',
  'Successful Free Throws': 'ftm', 'Total Free Throws': 'fta',
  'Total Rebounds': 'reb', 'Total Offensive Rebounds': 'oreb', 'Total Defensive Rebounds': 'dreb',
  'Total Assists': 'ast', 'Total Steals': 'stl', 'Total Blocks': 'blk',
  'Total Turnovers': 'to', 'Total Fouls': 'pf', 'Plus Minus': 'pm',
}

// ---------- small helpers ----------

export const nyDate = (d = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
const nyTime = iso => new Date(iso).toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' })
export function addDays(iso, n) {
  const d = new Date(iso + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
const sum = a => a.reduce((x, y) => x + y, 0)
const r1 = n => Math.round(n * 10) / 10

// Highlightly team nicknames ("Trail Blazers", "76ers") -> our abbreviations.
const byNick = Object.fromEntries(TEAMS.map(t => [t.nickname.toLowerCase(), t.abbr]))
function abbrOf(team) {
  const a = byNick[(team.name || '').toLowerCase()]
  if (!a) throw new Error(`Unknown team: ${team.displayName || team.name}`)
  return a
}

// Run fn over items with limited concurrency.
async function pool(items, limit, fn) {
  const out = new Array(items.length)
  let i = 0
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const n = i++
      out[n] = await fn(items[n], n)
    }
  }))
  return out
}

class Stop extends Error {}

// ---------- main ----------

export async function refresh({ store, key, deadline = Infinity, log = console.log }) {
  if (!key) throw new Error('HIGHLIGHTLY_API_KEY is not set')
  const started = Date.now()

  let remaining = Infinity
  let used = 0
  let stopped = false

  async function api(pathname) {
    if (remaining <= RESERVE || Date.now() > deadline) throw new Stop()
    remaining-- // reserve before the call so parallel requests can't overshoot
    const res = await fetch(API + pathname, { headers: { 'x-rapidapi-key': key } })
    used++
    const left = Number(res.headers.get('x-ratelimit-requests-remaining'))
    if (!Number.isNaN(left)) remaining = Math.min(remaining, left)
    if (res.status === 429) { remaining = 0; throw new Stop() }
    if (!res.ok) throw new Error(`${res.status} ${pathname}: ${(await res.text()).slice(0, 200)}`)
    return res.json()
  }

  // Fetch once, then serve from the cache forever. Responses that fail `ok`
  // (e.g. a box score that isn't filled in yet) aren't cached.
  async function cached(k, pathname, ok = () => true) {
    const hit = await store.get(`cache/${k}`)
    if (hit) return hit
    const data = await api(pathname)
    if (ok(data)) await store.set(`cache/${k}`, data)
    return data
  }

  // Swallow Stop so the run can still write what it has. With `label`, other
  // errors are logged and skipped too (one bad game shouldn't sink the run).
  const attempt = async (fn, label) => {
    try { return await fn() } catch (e) {
      if (e instanceof Stop) { stopped = true; return null }
      if (!label) throw e
      log(`Skipped ${label}: ${e.message}`)
      return null
    }
  }

  const today = nyDate()
  const yesterday = addDays(today, -1)
  const tomorrow = addDays(today, 1)
  const [ty, tm] = today.split('-').map(Number)
  const season = tm >= 8 ? ty + 1 : ty // seasons are named by their ending year

  // 1. Standings (also tells us when the season started).
  const groups = await attempt(() => Promise.all(['EAST', 'WEST'].map(async conf => {
    const res = await api(`/standings?abbreviation=${conf}&year=${season}&limit=10`)
    const g = res.data.find(x => x.seasonType === 'Regular Season')
    if (!g) throw new Error(`No regular-season standings for ${conf} ${season}`)
    return g
  })))
  if (!groups) throw new Error('Out of requests before standings could be fetched')
  const seasonStart = nyDate(new Date(groups[0].startDate))

  // Save standings right away (plus today's snapshot for the 7-day seed change).
  const rows = groups.flatMap(g => g.data.map(r => {
    const s = Object.fromEntries(r.statistics.map(x => [x.displayName, x.value]))
    return {
      abbr: abbrOf(r.team), seed: Number(s.Position), w: Number(s.Wins), l: Number(s.Losses),
      home: s.Home, away: s.Road, conf: s.CONF, ppg: Number(s['Points Per Game']), opp: Number(s['Opponent Points Per Game']),
      streak: s.Streak, last10: s['Last Ten Games'], clincher: s.Clincher || null,
    }
  }))
  await store.set(`history/standings-${today}.json`, rows.map(r => ({ abbr: r.abbr, seed: r.seed })))
  const weekAgo = (await store.list('history/standings-'))
    .filter(k => k.slice(-15, -5) <= addDays(today, -7)).sort().pop()
  const past = weekAgo ? Object.fromEntries((await store.get(weekAgo)).map(r => [r.abbr, r.seed])) : {}
  await store.set('data/standings.json', { asOf: yesterday, rows: rows.map(r => ({ ...r, seed7dAgo: past[r.abbr] ?? null })) })


  // 2. Games for every day of the season. Settled past days come from cache.
  const dates = [tomorrow, today]
  for (let d = yesterday; d >= seasonStart; d = addDays(d, -1)) dates.push(d)
  const matchesByDate = {}
  await pool(dates, 6, d => attempt(async () => {
    const hit = d < today && await store.get(`cache/matches/${d}.json`)
    if (hit) return (matchesByDate[d] = hit)
    const res = await api(`/matches?date=${d}&league=NBA&timezone=${encodeURIComponent(TZ)}&limit=100`)
    matchesByDate[d] = res.data
    if (d < today && res.data.every(m => DONE.has(m.state.description))) await store.set(`cache/matches/${d}.json`, res.data)
  }, `games on ${d}`))

  // 3. Game list with records as of each game (walk the season in order).
  const all = Object.entries(matchesByDate)
    .flatMap(([date, ms]) => ms.map(m => ({ ...m, day: date })))
    .sort((a, b) => a.date.localeCompare(b.date))
  const rec = Object.fromEntries(TEAMS.map(t => [t.abbr, { w: 0, l: 0, hw: 0, hl: 0, aw: 0, al: 0 }]))
  const recOf = (abbr, home) => {
    const r = rec[abbr]
    return { record: `${r.w}-${r.l}`, split: home ? `${r.hw}-${r.hl}` : `${r.aw}-${r.al}` }
  }
  const games = all.map(m => {
    const away = abbrOf(m.awayTeam), home = abbrOf(m.homeTeam)
    const g = { id: String(m.id), date: m.day, tipUtc: m.date, tip: nyTime(m.date), awayTeamId: m.awayTeam.id, homeTeamId: m.homeTeam.id }
    if (m.state.description !== 'Finished') {
      const note = m.state.description === 'Scheduled' ? null : m.state.description
      return { ...g, status: 'scheduled', note, away: { abbr: away, ...recOf(away, false) }, home: { abbr: home, ...recOf(home, true) } }
    }
    const aq = m.state.score.awayTeam, hq = m.state.score.homeTeam
    const as = sum(aq), hs = sum(hq)
    const ra = rec[away], rh = rec[home]
    if (as > hs) { ra.w++; ra.aw++; rh.l++; rh.hl++ } else { rh.w++; rh.hw++; ra.l++; ra.al++ }
    return { ...g, status: 'final', away: { abbr: away, score: as, quarters: aq, ...recOf(away, false) }, home: { abbr: home, score: hs, quarters: hq, ...recOf(home, true) } }
  })
  const strip = ({ awayTeamId, homeTeamId, ...g }) => g

  const byDate = {}
  for (const g of games) (byDate[g.date] ??= []).push(strip(g))
  await pool(Object.entries(byDate), 10, ([d, gs]) =>
    store.set(`data/games/${d}.json`, gs.sort((a, b) => a.tipUtc.localeCompare(b.tipUtc))))

  // 4. Box scores for finished games not yet published, newest first. Each needs
  //    the box score plus the lineups (for positions): two requests per game.
  const published = new Set((await store.list('data/box/')).map(k => k.split('/').pop().replace('.json', '')))
  const todo = games.filter(g => g.status === 'final' && !published.has(g.id)).reverse()
  const fetched = new Set()
  await pool(todo, 4, g => attempt(async () => {
    const [box, lineups] = await Promise.all([
      cached(`box/${g.id}.json`, `/box-score/${g.id}`, b => b.some(t => t.boxScores?.length)),
      cached(`lineups/${g.id}.json`, `/lineups/${g.id}`, l => l?.home?.lineup?.length > 0),
    ])
    if (!box.some(t => t.boxScores?.length)) return // not available yet; retried next run
    const pos = {}
    for (const side of ['home', 'away']) for (const p of lineups?.[side]?.lineup ?? []) pos[p.id] = p.positionAbbreviation || ''
    const lines = teamId => {
      const t = box.find(x => x.team.id === teamId)
      return (t?.boxScores ?? []).flatMap((b, i) => {
        if (!b.statistics.length) return [] // DNP
        const s = Object.fromEntries(Object.values(STAT).map(k => [k, 0]))
        for (const { name, value } of b.statistics) if (STAT[name]) s[STAT[name]] = Number(value) || 0
        return [{ id: b.player.id, name: b.player.name, num: String(b.player.jersey ?? ''), pos: pos[b.player.id] ?? '', starter: i < 5, ...s }]
      })
    }
    const away = lines(g.awayTeamId), home = lines(g.homeTeamId)
    const out = strip(g)
    await store.set(`data/box/${g.id}.json`, { ...out, away: { ...out.away, players: away }, home: { ...out.home, players: home } })
    fetched.add(g.id)
  }, `box score ${g.id}`))

  // 5. lines/DATE.json: every player line for a date, built from published box
  //    scores. Any published game missing from its day's file gets added, so an
  //    interrupted run repairs itself next time.
  const finalsByDate = {}
  for (const g of games) if (g.status === 'final' && (published.has(g.id) || fetched.has(g.id))) (finalsByDate[g.date] ??= []).push(g.id)
  let linesChanged = false
  await pool(Object.entries(finalsByDate), 6, async ([d, ids]) => {
    const prev = (await store.get(`data/lines/${d}.json`)) ?? []
    const have = new Set(prev.map(p => p.gameId))
    const missing = ids.filter(id => !have.has(id))
    if (!missing.length) return
    const add = (await pool(missing, 6, id => store.get(`data/box/${id}.json`))).flatMap(b =>
      b ? [b.away, b.home].flatMap(t => t.players.map(p => ({ ...p, abbr: t.abbr, gameId: b.id }))) : [])
    await store.set(`data/lines/${d}.json`, prev.concat(add))
    linesChanged = true
  })

  // 6. Season averages and awards from every published player line. Only
  //    recomputed when lines changed or the awards formula version changed.
  let playerCount = null
  const awardsStale = (await store.get('cache/awards-version.json'))?.v !== AWARDS_VERSION
  const lineKeys = (await store.list('data/lines/')).sort()
  // Any day with player lines but no awards file (e.g. a run cut off mid-save)?
  const haveAwards = new Set((await store.list('data/awards/')).map(k => k.slice(-15, -5)))
  const awardsMissing = lineKeys.some(k => !haveAwards.has(k.slice(-15, -5)))
  if (linesChanged || awardsStale || awardsMissing || !(await store.get('data/averages.json'))) {
    const days = await pool(lineKeys, 20, k => store.get(k))

    const awards = computeAwards(lineKeys.map((k, i) => ({ date: k.slice(-15, -5), lines: days[i] })))
    await pool(Object.entries(awards), 10, ([d, a]) => store.set(`data/awards/${d}.json`, a))
    await store.set('cache/awards-version.json', { v: AWARDS_VERSION })

    const acc = {}
    for (const day of days) {
      for (const p of day ?? []) {
        if (!p.min) continue
        const a = (acc[p.id] ??= { id: p.id, gp: 0, tot: Object.fromEntries(Object.values(STAT).map(k => [k, 0])) })
        a.gp++
        Object.assign(a, { name: p.name, num: p.num, pos: p.pos || a.pos || '', abbr: p.abbr })
        for (const k of Object.keys(a.tot)) a.tot[k] += p[k]
      }
    }
    const pct = (m, a) => (a ? r1((100 * m) / a) : 0)
    const averages = Object.values(acc).map(({ tot: t, gp, ...p }) => ({
      ...p, gp,
      min: r1(t.min / gp), pts: r1(t.pts / gp), reb: r1(t.reb / gp), ast: r1(t.ast / gp),
      stl: r1(t.stl / gp), blk: r1(t.blk / gp), tov: r1(t.to / gp), pm: r1(t.pm / gp),
      fgPct: pct(t.fgm, t.fga), tpPct: pct(t.tpm, t.tpa), ftPct: pct(t.ftm, t.fta),
    }))
    await store.set('data/averages.json', averages)
    playerCount = averages.length
  }

  const backlog = todo.length - fetched.size
  const meta = { updatedAt: new Date().toISOString(), season, requests: used, remaining, backlog, complete: !stopped && backlog === 0 }
  await store.set('data/meta.json', meta)
  log(`${used} requests used, ${remaining === Infinity ? '?' : remaining} left today; ${games.length} games, ${published.size + fetched.size} box scores${playerCount == null ? '' : `, ${playerCount} players`}; ${((Date.now() - started) / 1000).toFixed(1)}s.`)
  if (backlog) log(`${backlog} box scores still to fetch; the next run continues.`)
  return meta
}
