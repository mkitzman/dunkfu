// Player game logs for the player card, one file per team (data/teams/ABBR.json).
//
// Built from what the pipeline already has: every night's player lines (with
// DNP rows, { dnp: true }), the nightly awards, and the game list. A player
// traded mid-season appears in each of his teams' files with his full log, so
// a card opened from any of his games finds him.
//
// Awards per game line (keys in display order, see src/data/awards.js):
//   potn  Player of the Night       awards[date].night.performer
//   potg  Player of the Game        awards[date].games[gameId].performer
//   breakout  Breakout              awards[date].night.breakout
//   pts / reb / ast                 nightly league high (ties all count)
//   stl   Ball Hawk, 5+ steals   blk  Rim Protector, 5+ blocks (thresholds in awards.js; each happens
//         about once every night or two league-wide)
//   bricklayer  most missed shots   awards[date].night.bricklayer
//   dud   Dud of the Night          awards[date].night.dud
//   dudg  Dud of the Game           awards[date].games[gameId].dud
//   dnp   on the box score but didn't play (the API gives no reason)
//   inj   missed one of his team's games entirely while on the team; the API
//         doesn't say why, so this also covers suspensions and personal leave

const STATS = ['min', 'pts', 'reb', 'oreb', 'dreb', 'ast', 'stl', 'blk', 'to', 'pf', 'pm', 'fgm', 'fga', 'tpm', 'tpa', 'ftm', 'fta']
const MAX_TRAILING_MISSED = 15
import { BALL_HAWK_STL, RIM_PROTECTOR_BLK } from './awards.js'

export const AWARD_ORDER = ['potn', 'potg', 'breakout', 'pts', 'reb', 'ast', 'stl', 'blk', 'bricklayer', 'dud', 'dudg', 'dnp', 'inj']

// dayLines: { [date]: line[] }  awards: { [date]: { night, games } }
// games: [{ id, date, status, tipUtc, tip, away: { abbr, score }, home: { abbr, score } }]
// today: YYYY-MM-DD (NY). Returns { [abbr]: { abbr, players: { [id]: player }, upcoming } }
export function buildTeamLogs({ dayLines, awards, games, today }) {
  const finals = games.filter(g => g.status === 'final').sort((a, b) => a.tipUtc.localeCompare(b.tipUtc))
  const gameById = Object.fromEntries(finals.map(g => [g.id, g]))

  const highs = Object.fromEntries(Object.entries(dayLines).map(([date, lines]) => [date, nightHighs(lines)]))

  // Every line (played or DNP) per player, in date order.
  const byPlayer = {}
  for (const date of Object.keys(dayLines).sort()) {
    for (const p of dayLines[date] ?? []) {
      if (!gameById[p.gameId]) continue
      ;(byPlayer[p.id] ??= []).push({ ...p, date })
    }
  }

  const out = {}
  const teamFile = abbr => (out[abbr] ??= { abbr, players: {}, upcoming: upcomingFor(abbr, games, today) })

  for (const [id, lines] of Object.entries(byPlayer)) {
    const last = lines.at(-1)
    const entries = lines.map(p => entry(p, gameById[p.gameId], awards[p.date], highs[p.date]))

    // Injured: games of a team he was on (from his first game with them to his
    // last, or to now for his current team) where he isn't listed at all. The
    // API has no rosters, so after MAX_TRAILING_MISSED straight missed games
    // since his last line we assume he was released and stop counting.
    const seen = new Set(lines.map(p => p.gameId))
    const spans = {}
    for (const p of lines) (spans[p.abbr] ??= { from: p.date, to: p.date }).to = p.date
    for (const [abbr, s] of Object.entries(spans)) {
      let trailing = 0
      for (const g of finals) {
        if (g.date < s.from || seen.has(g.id)) continue
        if (g.away.abbr !== abbr && g.home.abbr !== abbr) continue
        if (g.date > s.to && (abbr !== last.abbr || ++trailing > MAX_TRAILING_MISSED)) break
        entries.push(entry({ abbr, date: g.date, gameId: g.id, inj: true }, g, null, null))
      }
    }
    entries.sort((a, b) => a.date.localeCompare(b.date))

    const player = {
      id: Number(id), name: last.name, num: last.num, pos: last.pos || '', abbr: last.abbr,
      gp: entries.filter(e => e.min > 0).length,
      games: entries,
    }
    for (const abbr of Object.keys(spans)) teamFile(abbr).players[id] = player
  }
  // Teams with no player lines yet still get a file (upcoming games).
  for (const g of games) for (const s of ['away', 'home']) teamFile(g[s].abbr)
  return out
}

function entry(p, g, aw, high) {
  const home = g.home.abbr === p.abbr
  const us = home ? g.home : g.away, them = home ? g.away : g.home
  const e = {
    date: p.date, gameId: g.id, team: p.abbr, home, opp: them.abbr,
    result: us.score > them.score ? 'W' : 'L', score: `${us.score}-${them.score}`,
  }
  if (p.inj) e.awards = ['inj']
  else if (p.dnp) e.awards = ['dnp']
  else {
    for (const k of STATS) e[k] = p[k] ?? 0
    e.starter = !!p.starter
    e.awards = lineAwards(p, aw, high)
  }
  return e
}

// Nightly league highs among players who played.
function nightHighs(lines) {
  const played = (lines ?? []).filter(p => !p.dnp && p.min > 0)
  return Object.fromEntries(['pts', 'reb', 'ast'].map(k => [k, Math.max(0, ...played.map(p => p[k]))]))
}

// Award keys (display order) one played line earned that night.
function lineAwards(p, aw, high) {
  const is = x => x && String(x.id) === String(p.id)
  const keys = []
  if (is(aw?.night?.performer)) keys.push('potn')
  if (is(aw?.games?.[p.gameId]?.performer)) keys.push('potg')
  if (is(aw?.night?.breakout)) keys.push('breakout')
  for (const k of ['pts', 'reb', 'ast']) if (high && p.min > 0 && p[k] > 0 && p[k] === high[k]) keys.push(k)
  if (p.stl >= BALL_HAWK_STL) keys.push('stl')
  if (p.blk >= RIM_PROTECTOR_BLK) keys.push('blk')
  if (is(aw?.night?.bricklayer)) keys.push('bricklayer')
  if (is(aw?.night?.dud)) keys.push('dud')
  if (is(aw?.games?.[p.gameId]?.dud)) keys.push('dudg')
  return AWARD_ORDER.filter(k => keys.includes(k))
}

// { [playerId]: award keys } for one night's played lines that earned any
// (the day page's player table shows them next to the name).
export function nightPlayerAwards(lines, aw) {
  const high = nightHighs(lines)
  const out = {}
  for (const p of lines ?? []) {
    if (p.dnp || !(p.min > 0)) continue
    const keys = lineAwards(p, aw, high)
    if (keys.length) out[p.id] = keys
  }
  return out
}

// The team's next three games we have on the schedule.
function upcomingFor(abbr, games, today) {
  return games
    .filter(g => g.status !== 'final' && g.date >= today && (g.away.abbr === abbr || g.home.abbr === abbr))
    .sort((a, b) => a.tipUtc.localeCompare(b.tipUtc))
    .slice(0, 3)
    .map(g => ({ date: g.date, tipUtc: g.tipUtc, tip: g.tip, gameId: g.id, home: g.home.abbr === abbr, opp: g.home.abbr === abbr ? g.away.abbr : g.home.abbr }))
}
