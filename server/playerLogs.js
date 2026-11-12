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
//   pts / reb / ast                 nightly league high (ties all count)
//   stl   Ball Hawk, 5+ steals   blk  Rim Protector, 5+ blocks (each happens
//         about once every night or two league-wide)
//   dud   Dud of the Night          awards[date].night.dud
//   dnp   on the box score but didn't play (the API gives no reason)
//   inj   missed one of his team's games entirely while on the team; the API
//         doesn't say why, so this also covers suspensions and personal leave

const STATS = ['min', 'pts', 'reb', 'oreb', 'dreb', 'ast', 'stl', 'blk', 'to', 'pf', 'pm', 'fgm', 'fga', 'tpm', 'tpa', 'ftm', 'fta']
export const AWARD_ORDER = ['potn', 'potg', 'pts', 'reb', 'ast', 'stl', 'blk', 'dud', 'dnp', 'inj']

// dayLines: { [date]: line[] }  awards: { [date]: { night, games } }
// games: [{ id, date, status, tipUtc, tip, away: { abbr, score }, home: { abbr, score } }]
// today: YYYY-MM-DD (NY). Returns { [abbr]: { abbr, players: { [id]: player }, upcoming } }
export function buildTeamLogs({ dayLines, awards, games, today }) {
  const finals = games.filter(g => g.status === 'final').sort((a, b) => a.tipUtc.localeCompare(b.tipUtc))
  const gameById = Object.fromEntries(finals.map(g => [g.id, g]))

  // Nightly league highs (players who played).
  const highs = {}
  for (const [date, lines] of Object.entries(dayLines)) {
    const played = (lines ?? []).filter(p => !p.dnp && p.min > 0)
    highs[date] = Object.fromEntries(['pts', 'reb', 'ast'].map(k => [k, Math.max(0, ...played.map(p => p[k]))]))
  }

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
    // last, or to now for his current team) where he isn't listed at all.
    const seen = new Set(lines.map(p => p.gameId))
    const spans = {}
    for (const p of lines) (spans[p.abbr] ??= { from: p.date, to: p.date }).to = p.date
    for (const [abbr, s] of Object.entries(spans)) {
      const to = abbr === last.abbr ? '9999-12-31' : s.to
      for (const g of finals) {
        if (g.date < s.from || g.date > to || seen.has(g.id)) continue
        if (g.away.abbr !== abbr && g.home.abbr !== abbr) continue
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
  const awardKeys = []
  if (p.inj) awardKeys.push('inj')
  else if (p.dnp) awardKeys.push('dnp')
  else {
    for (const k of STATS) e[k] = p[k] ?? 0
    e.starter = !!p.starter
    const is = x => x && String(x.id) === String(p.id)
    if (is(aw?.night?.performer)) awardKeys.push('potn')
    if (is(aw?.games?.[g.id]?.performer)) awardKeys.push('potg')
    for (const k of ['pts', 'reb', 'ast']) if (high && p.min > 0 && p[k] > 0 && p[k] === high[k]) awardKeys.push(k)
    if (p.stl >= 5) awardKeys.push('stl')
    if (p.blk >= 5) awardKeys.push('blk')
    if (is(aw?.night?.dud)) awardKeys.push('dud')
  }
  e.awards = AWARD_ORDER.filter(k => awardKeys.includes(k))
  return e
}

// The team's next three games we have on the schedule.
function upcomingFor(abbr, games, today) {
  return games
    .filter(g => g.status !== 'final' && g.date >= today && (g.away.abbr === abbr || g.home.abbr === abbr))
    .sort((a, b) => a.tipUtc.localeCompare(b.tipUtc))
    .slice(0, 3)
    .map(g => ({ date: g.date, tipUtc: g.tipUtc, tip: g.tip, gameId: g.id, home: g.home.abbr === abbr, opp: g.home.abbr === abbr ? g.away.abbr : g.home.abbr }))
}
