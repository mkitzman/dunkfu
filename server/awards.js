// High Performer and Dud, per game and per night, built on John Hollinger's
// Game Score (one number for a whole stat line: ~10 is average, 20+ very good).
//
// High Performer: highest Game Score, nudged up for beating the player's own
//   average (so a big night from a role player can edge a routine star game).
// Dud: biggest shortfall against expectation, where expectation is the
//   player's Game Score per minute this season times tonight's minutes. Only
//   real contributors qualify (avg Game Score 10+, 3+ prior games, 20+ minutes
//   tonight, so early exits and bench players aren't picked). If nobody
//   qualifies (early season), it falls back to the lowest Game Score among
//   starters who played 20+ minutes.
//
// Bump VERSION whenever the formulas change so stored awards are recomputed.

export const VERSION = 2

const MIN_MINUTES = 20
const MIN_PRIOR_GAMES = 3
const MIN_AVG_GAME_SCORE = 10
const BEAT_AVG_WEIGHT = 0.25

const r1 = n => Math.round(n * 10) / 10

export const gameScore = p =>
  p.pts + 0.4 * p.fgm - 0.7 * p.fga - 0.4 * (p.fta - p.ftm) + 0.7 * p.oreb + 0.3 * p.dreb +
  p.stl + 0.7 * p.ast + 0.7 * p.blk - 0.4 * p.pf - p.to

// days: [{ date, lines }] in date order. Returns { [date]: { night, games: { [gameId]: { performer, dud } } } }.
export function computeAwards(days) {
  const hist = {} // player id -> { n, gs, min } from earlier days
  const out = {}

  for (const { date, lines } of days) {
    const rows = (lines ?? []).filter(p => p.min > 0).map(p => {
      const h = hist[p.id]
      const gs = gameScore(p)
      const known = h && h.n >= MIN_PRIOR_GAMES && h.min > 0
      const exp = known ? (h.gs / h.min) * p.min : null
      return {
        p, gs, exp,
        avg: known ? h.gs / h.n : null,
        perf: gs + (exp != null ? BEAT_AVG_WEIGHT * Math.max(0, gs - exp) : 0),
      }
    })

    const pick = list => ({ performer: performer(list), dud: dud(list) })
    const byGame = {}
    for (const r of rows) (byGame[r.p.gameId] ??= []).push(r)
    out[date] = {
      night: pick(rows),
      games: Object.fromEntries(Object.entries(byGame).map(([id, list]) => [id, pick(list)])),
    }

    for (const { p, gs } of rows) {
      const h = (hist[p.id] ??= { n: 0, gs: 0, min: 0 })
      h.n++; h.gs += gs; h.min += p.min
    }
  }
  return out
}

function performer(rows) {
  const best = rows.reduce((a, b) => (!a || b.perf > a.perf ? b : a), null)
  return best && entry(best, 'season')
}

function dud(rows) {
  const eligible = rows.filter(r => r.exp != null && r.avg >= MIN_AVG_GAME_SCORE && r.p.min >= MIN_MINUTES)
  const worst = eligible.reduce((a, b) => (!a || b.gs - b.exp < a.gs - a.exp ? b : a), null)
  if (worst && worst.gs < worst.exp) return entry(worst, 'expected')
  const starters = rows.filter(r => r.p.starter && r.p.min >= MIN_MINUTES)
  const low = starters.reduce((a, b) => (!a || b.gs < a.gs ? b : a), null)
  return low && entry(low, null)
}

function entry({ p, gs, exp }, basis) {
  return {
    id: p.id, name: p.name, num: p.num, pos: p.pos, abbr: p.abbr, gameId: p.gameId,
    gs: r1(gs), exp: exp == null ? null : r1(exp), basis: exp == null ? null : basis,
    min: p.min, pts: p.pts, reb: p.reb, ast: p.ast, stl: p.stl, blk: p.blk, to: p.to,
    fgm: p.fgm, fga: p.fga, tpm: p.tpm, tpa: p.tpa, ftm: p.ftm, fta: p.fta, pm: p.pm,
  }
}
