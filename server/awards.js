// High Performer and Dud, per game and per night, built on John Hollinger's
// Game Score (one number for a whole stat line: ~10 is average, 20+ very good).
//
// High Performer: the highest Game Score. No bonus for beating his own
//   average: it let Herro's 50/11/7 (47.5) beat Wembanyama's 50/19 with
//   5 blocks (48.2). Surprise nights are meant for their own award.
// Dud: biggest shortfall against expectation, where expectation is the
//   player's Game Score per minute this season times tonight's minutes. Only
//   real contributors qualify: tonight's starters, or anyone averaging a Game
//   Score of 10+ (so a starter on a weak team still counts), with 3+ prior
//   games and 20+ minutes tonight (so early exits and deep-bench players
//   aren't picked), and only for a
//   genuinely poor night: Game Score under 15 and at least 5 points or 25%
//   below expectation (so a 22/9/11 night just under a high bar isn't a dud),
//   and never with 10+ rebounds or 10+ assists (fans read that as a good night,
//   e.g. Naz Reid's 12/10/3 on 4-19 shooting).
//   If nobody qualifies there is no dud.
//
// Nightly cards (night only, all games):
// Breakout: biggest jump in Game Score over his own season average per game
//   (3+ prior games), skipping the Player of the Night so it's someone else.
// Bricklayer: most missed shots, (FGA - FGM) + (FTA - FTM) (threes are inside
//   FGA); ties go to the lower True Shooting percentage (TS%, shown on the card).
// Ball Hawk / Rim Protector: most steals / blocks, if 5+ (about once every
//   night or two league-wide); ties go to the higher Game Score.
//
// Bump VERSION whenever the formulas change so stored awards are recomputed.

export const VERSION = 11

const MIN_MINUTES = 20
const MIN_PRIOR_GAMES = 3
const MIN_AVG_GAME_SCORE = 10 // ...unless they started
const DUD_MAX_GAME_SCORE = 15 // a 15+ Game Score is a good night, never a dud
const DUD_MIN_SHORTFALL = 5 // Game Score points below expectation...
const DUD_MIN_SHORTFALL_PCT = 0.25 // ...or this fraction below it
const DUD_SAFE_REB_AST = 10 // 10+ rebounds or assists is never a dud
export const BALL_HAWK_STL = 5
export const RIM_PROTECTOR_BLK = 5

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
        ppg: known ? h.pts / h.n : null,
      }
    })

    const pick = list => ({ performer: performer(list), dud: dud(list) })
    const byGame = {}
    for (const r of rows) (byGame[r.p.gameId] ??= []).push(r)
    const night = pick(rows)
    out[date] = {
      night: {
        ...night,
        breakout: breakout(rows, night.performer),
        bricklayer: bricklayer(rows),
        ballHawk: most(rows, 'stl', BALL_HAWK_STL),
        rimProtector: most(rows, 'blk', RIM_PROTECTOR_BLK),
      },
      games: Object.fromEntries(Object.entries(byGame).map(([id, list]) => [id, pick(list)])),
    }

    for (const { p, gs } of rows) {
      const h = (hist[p.id] ??= { n: 0, gs: 0, min: 0, pts: 0 })
      h.n++; h.gs += gs; h.min += p.min; h.pts += p.pts
    }
  }
  return out
}

function performer(rows) {
  const best = rows.reduce((a, b) => (!a || b.gs > a.gs ? b : a), null)
  return best && entry(best, 'season')
}

function dud(rows) {
  const eligible = rows.filter(r => {
    if (r.exp == null || r.p.min < MIN_MINUTES) return false
    if (!r.p.starter && r.avg < MIN_AVG_GAME_SCORE) return false
    if (r.gs >= DUD_MAX_GAME_SCORE) return false
    if (r.p.reb >= DUD_SAFE_REB_AST || r.p.ast >= DUD_SAFE_REB_AST) return false
    const short = r.exp - r.gs
    return short >= DUD_MIN_SHORTFALL || short >= DUD_MIN_SHORTFALL_PCT * r.exp
  })
  const worst = eligible.reduce((a, b) => (!a || b.gs - b.exp < a.gs - a.exp ? b : a), null)
  return worst ? entry(worst, 'expected') : null
}

const best = (rows, score) => {
  const top = rows.reduce((a, b) => (!a || score(b) > score(a) ? b : a), null)
  return top && entry(top, null)
}

function breakout(rows, performer) {
  const r = rows.filter(r => r.avg != null && String(r.p.id) !== String(performer?.id))
    .reduce((a, b) => (!a || b.gs - b.avg > a.gs - a.avg ? b : a), null)
  return r && { ...entry(r, null), ppg: r1(r.ppg) } // his scoring average before tonight
}

const misses = p => p.fga - p.fgm + p.fta - p.ftm
// True Shooting: points per two shot attempts, a free throw ~0.44 of an attempt.
export const trueShooting = p => p.pts / (2 * (p.fga + 0.44 * p.fta) || 1)
function bricklayer(rows) {
  const top = rows.filter(r => misses(r.p) > 0).reduce((a, b) => {
    if (!a) return b
    const d = misses(b.p) - misses(a.p)
    return d > 0 || (d === 0 && trueShooting(b.p) < trueShooting(a.p)) ? b : a
  }, null)
  return top && { ...entry(top, null), missed: misses(top.p), ts: r1(100 * trueShooting(top.p)) }
}

function most(rows, k, min) {
  return best(rows.filter(r => r.p[k] >= min), r => r.p[k] * 1000 + r.gs)
}

function entry({ p, gs, exp }, basis) {
  return {
    id: p.id, name: p.name, num: p.num, pos: p.pos, abbr: p.abbr, gameId: p.gameId,
    gs: r1(gs), exp: exp == null ? null : r1(exp), basis: exp == null ? null : basis,
    min: p.min, pts: p.pts, reb: p.reb, ast: p.ast, stl: p.stl, blk: p.blk, to: p.to,
    fgm: p.fgm, fga: p.fga, tpm: p.tpm, tpa: p.tpa, ftm: p.ftm, fta: p.fta, pm: p.pm,
  }
}
