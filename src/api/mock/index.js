import { rng, RECORDS, PLAYERS, DAYS, BOX } from './data.js'
import TEAMS from '../../data/teams.json'

const BOX_FIELDS = ['name', 'num', 'pos', 'min', 'pts', 'fgm', 'fga', 'tpm', 'tpa', 'ftm', 'fta', 'oreb', 'dreb', 'ast', 'stl', 'blk', 'to', 'pf', 'pm']

const gameId = (date, away, home) => `${date}-${away}-${home}`

// Standings rows with record splits, built the same way as the prototype.
const standings = RECORDS.map(([abbr, w, l, seedChange]) => {
  const r = rng(abbr), gp = w + l, pct = w / gp
  const hw = Math.min(w, Math.round(r() * w))
  const hg = Math.min(gp, hw + Math.round(r() * Math.max(0, l - 1)))
  const aw = w - hw, al = l - (hg - hw)
  const cw = Math.max(0, Math.min(w, w - Math.round(r() * 1.4))), cl = Math.max(0, l - Math.round(r() * 1.4))
  const diff = Math.round(((pct - 0.5) * 24 + (r() - 0.5) * 6) * 10) / 10
  const ppg = Math.round((112 + (r() - 0.5) * 12 + diff / 2) * 10) / 10
  const opp = Math.round((ppg - diff) * 10) / 10
  const lastWin = r() < pct, n = 1 + Math.round(r() * Math.min(3, lastWin ? w - 1 : l - 1))
  return {
    abbr, w, l, seedChange,
    home: `${hw}-${hg - hw}`, away: `${aw}-${al}`, conf: `${cw}-${cl}`,
    ppg, opp, streak: (lastWin ? 'W' : 'L') + Math.max(1, n), last10: `${w}-${l}`,
  }
})
const byAbbr = Object.fromEntries(standings.map(s => [s.abbr, s]))

const teamRecord = (abbr, isHome) => {
  const s = byAbbr[abbr]
  return { record: `${s.w}-${s.l}`, split: isHome ? s.home : s.away }
}

function playerLine([name, pos, num], abbr, i, won, seed) {
  const r = rng(name + seed), star = i === 0
  const min = star ? 33 + r() * 7 : 21 + r() * 13
  const pts = star ? 18 + r() * 20 : 5 + r() * 17
  const fga = Math.max(4, Math.round(pts / (1.8 + r() * 0.8))), fgm = Math.round(fga * (0.38 + r() * 0.2))
  const tpa = Math.round(2 + r() * 7), tpm = Math.round(tpa * (0.25 + r() * 0.25))
  const fta = Math.round(r() * 8), ftm = Math.round(fta * (0.7 + r() * 0.3))
  const reb = (pos === 'C' ? 7 : 3) + r() * 7, ast = (pos === 'G' ? 4 : 1.5) + r() * 6
  const stl = r() * 2.4, blk = (pos === 'C' ? 1 : 0) + r() * 1.6, tov = 0.5 + r() * 3.5
  const pm = (won ? 1 : -1) * (1 + r() * 18)
  return { name, num, pos, abbr, min, pts, reb, ast, stl, blk, tov, fgm, fga, tpm, tpa, ftm, fta, pm }
}

function boxPlayers(id) {
  const box = BOX[id]
  if (!box) return null
  const parse = rows => rows.map((a, i) => {
    const p = Object.fromEntries(BOX_FIELDS.map((k, j) => [k, a[j]]))
    return { ...p, reb: p.oreb + p.dreb, starter: i < 5 }
  })
  return { away: parse(box.away), home: parse(box.home) }
}

const sum = a => a.reduce((x, y) => x + y, 0)

export async function getGames(date) {
  const day = DAYS[date]
  if (!day) return []
  if (day.final) {
    return day.final.map(([away, home, aq, hq]) => ({
      id: gameId(date, away, home), date, status: 'final',
      away: { abbr: away, ...teamRecord(away, false), quarters: aq, score: sum(aq) },
      home: { abbr: home, ...teamRecord(home, true), quarters: hq, score: sum(hq) },
    }))
  }
  return day.scheduled.map(([away, home, tip, network]) => ({
    id: gameId(date, away, home), date, status: 'scheduled', tip, network: network || null,
    away: { abbr: away, ...teamRecord(away, false) },
    home: { abbr: home, ...teamRecord(home, true) },
  }))
}

// Player lines for every final on a date.
export async function getBoxscores(date) {
  const day = DAYS[date]
  if (!day?.final) return []
  const lines = []
  for (const [away, home, aq, hq] of day.final) {
    const awayWon = sum(aq) > sum(hq)
    const box = boxPlayers(gameId(date, away, home))
    for (const [abbr, won, side] of [[away, awayWon, 'away'], [home, !awayWon, 'home']]) {
      PLAYERS[abbr].forEach((p, i) => {
        const real = box?.[side].find(b => b.name === p[0])
        if (real) {
          lines.push({ ...real, abbr, tov: real.to })
        } else {
          const l = playerLine(p, abbr, i, won, date)
          const R = Math.round
          lines.push({ ...l, min: R(l.min), pts: R(l.pts), reb: R(l.reb), ast: R(l.ast), stl: R(l.stl), blk: R(l.blk), tov: R(l.tov), pm: R(l.pm) })
        }
      })
    }
  }
  return lines
}

// Season per-game averages for players on the given teams.
export async function getAverages(teams) {
  return teams.flatMap(abbr => (PLAYERS[abbr] || []).map((p, i) => {
    const l = playerLine(p, abbr, i, true, 'avg')
    const pct = (m, a) => (a ? (100 * m) / a : 0)
    const pm = (rng('pm' + p[0])() - 0.45) * 14
    return {
      name: l.name, num: l.num, pos: l.pos, abbr,
      min: l.min, pts: l.pts, reb: l.reb, ast: l.ast, stl: l.stl, blk: l.blk, tov: l.tov,
      fgPct: pct(l.fgm, l.fga), tpPct: pct(l.tpm, l.tpa), ftPct: pct(l.ftm, l.fta), pm,
    }
  }))
}

export async function getGame(id) {
  const date = id.slice(0, 10)
  const game = (await getGames(date)).find(g => g.id === id)
  if (!game) return null
  const box = boxPlayers(id)
  return {
    ...game,
    away: { ...game.away, players: box?.away ?? null },
    home: { ...game.home, players: box?.home ?? null },
  }
}

export async function getStandings() {
  const conf = Object.fromEntries(TEAMS.map(t => [t.abbr, t.conference]))
  const rows = standings.map(({ seedChange, ...s }) => ({ ...s, seedChange }))
  for (const c of ['E', 'W']) {
    rows.filter(r => conf[r.abbr] === c)
      .sort((a, b) => b.w / (b.w + b.l) - a.w / (a.w + a.l) || b.w - a.w || (b.ppg - b.opp) - (a.ppg - a.opp))
      .forEach((r, i) => { r.seed = i + 1 })
  }
  return rows.map(({ seedChange, ...r }) => ({ ...r, seed7dAgo: r.seed + seedChange }))
}
