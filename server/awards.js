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
// One a night (night only, all games):
// Lightning in a Bottle (key breakout): biggest jump in Game Score over his own season average per game
//   (3+ prior games), skipping the Player of the Night so it's someone else.
// Bricklayer: most missed shots, (FGA - FGM) + (FTA - FTM) (threes are inside
//   FGA), among players under 50% True Shooting (TS%, shown on the card), so a
//   star scoring efficiently on high volume never wins; ties go to the lower TS%.
// Ball Hog: most shots among players with 15+ FGA and at most 1 assist.
//
// Threshold awards (everyone who qualifies earns the badge, see earned()):
// Ball Hawk 5+ STL, Rim Protector 5+ BLK, Rainmaker 9+ 3PM, Good Day a
// triple-double, Double Double exactly two 10+ categories, Completionist every
// minute of the game, Trillionaire exactly 1 MIN and nothing else (fouls
// included), Cardio Day 5+ MIN and nothing else, Young Gun a Game Score of
// 22+ at 20 or under (birthdates in youngGuns.js).
//
// Featured cards (handoff rev 7): three slots, each the first award in its
// list with a winner, rarest first. The Player and Dud of the Night (of the
// Game, on a game page) are never featured again, and nobody twice. See SLOTS.
//
// Bump VERSION whenever the formulas change so stored awards are recomputed.

import { ageOn } from './youngGuns.js'

export const VERSION = 15 // 15: Young Gun

const MIN_MINUTES = 20
const MIN_PRIOR_GAMES = 3
const MIN_AVG_GAME_SCORE = 10 // ...unless they started
const DUD_MAX_GAME_SCORE = 15 // a 15+ Game Score is a good night, never a dud
const DUD_MIN_SHORTFALL = 5 // Game Score points below expectation...
const DUD_MIN_SHORTFALL_PCT = 0.25 // ...or this fraction below it
const DUD_SAFE_REB_AST = 10 // 10+ rebounds or assists is never a dud
export const BALL_HAWK_STL = 5
export const RIM_PROTECTOR_BLK = 5
const RAINMAKER_3PM = 9
const BALL_HOG_FGA = 15
const BALL_HOG_MAX_AST = 1
const CARDIO_MIN = 5
const YOUNG_GUN_MAX_AGE = 20
const YOUNG_GUN_GS = 22 // top ~5% of all lines; 15/2/2 is ~10

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

    const byGame = {}
    for (const r of rows) (byGame[r.p.gameId] ??= []).push(r)
    const len = Object.fromEntries(Object.entries(byGame).map(([id, list]) => [id, gameLength(list)]))
    for (const r of rows) r.keys = earned(r.p, len[r.p.gameId], date)

    const night = { performer: performer(rows), dud: dud(rows) }
    night.breakout = breakout(rows, night.performer)
    night.bricklayer = bricklayer(rows)
    night.ballHog = ballHog(rows)
    const relative = { breakout: night.breakout, bricklayer: night.bricklayer, hog: night.ballHog }
    night.cards = featured(rows, len, relative, [night.performer, night.dud], false, date)

    out[date] = {
      night,
      games: Object.fromEntries(Object.entries(byGame).map(([id, list]) => {
        const g = { performer: performer(list), dud: dud(list), len: len[id] }
        // One-a-night awards count here only if the night's winner played here.
        const here = Object.fromEntries(Object.entries(relative).map(([k, e]) => [k, e?.gameId === id ? e : null]))
        g.cards = featured(list, len, here, [g.performer, g.dud], true, date)
        return [id, g]
      })),
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

function breakout(rows, performer) {
  const r = rows.filter(r => r.avg != null && String(r.p.id) !== String(performer?.id))
    .reduce((a, b) => (!a || b.gs - b.avg > a.gs - a.avg ? b : a), null)
  return r && { ...entry(r, null), ppg: r1(r.ppg) } // his scoring average before tonight
}

const misses = p => p.fga - p.fgm + p.fta - p.ftm
// True Shooting: points per two shot attempts, a free throw ~0.44 of an attempt.
export const trueShooting = p => p.pts / (2 * (p.fga + 0.44 * p.fta) || 1)
const BRICKLAYER_MAX_TS = 0.5
function bricklayer(rows) {
  const top = rows.filter(r => misses(r.p) > 0 && trueShooting(r.p) < BRICKLAYER_MAX_TS).reduce((a, b) => {
    if (!a) return b
    const d = misses(b.p) - misses(a.p)
    return d > 0 || (d === 0 && trueShooting(b.p) < trueShooting(a.p)) ? b : a
  }, null)
  return top && { ...entry(top, null), missed: misses(top.p), ts: r1(100 * trueShooting(top.p)) }
}

function ballHog(rows) {
  const r = rows.filter(r => r.p.fga >= BALL_HOG_FGA && r.p.ast <= BALL_HOG_MAX_AST)
    .reduce((a, b) => (!a || b.p.fga * 100 + misses(b.p) > a.p.fga * 100 + misses(a.p) ? b : a), null)
  return r && entry(r, null)
}

// Game length in minutes from one team's minutes (5 on the floor): 48, plus 5
// per overtime. Box score minutes are rounded, so a team's total is 240 ± 3.
function gameLength(list) {
  const byTeam = {}
  for (const r of list) byTeam[r.p.abbr] = (byTeam[r.p.abbr] ?? 0) + r.p.min
  const most = Math.max(240, ...Object.values(byTeam))
  return 48 + 5 * Math.max(0, Math.round((most - 240) / 25))
}

const TEN = ['pts', 'reb', 'ast', 'stl', 'blk']
export const tens = p => TEN.filter(k => p[k] >= 10) // categories in double figures
const blank = p => ['pts', 'fga', 'fta', 'reb', 'ast', 'stl', 'blk', 'to', 'pf'].every(k => !p[k])

// Threshold award keys one played line earns (len: his game's length in
// minutes, date: the game's date).
export function earned(p, len, date) {
  const t = tens(p).length, k = []
  if (p.stl >= BALL_HAWK_STL) k.push('stl')
  if (p.blk >= RIM_PROTECTOR_BLK) k.push('blk')
  if (len && p.min >= len) k.push('cmp')
  if (t === 2) k.push('ddb')
  if (t >= 3) k.push('sun')
  const age = ageOn(p.name, date)
  if (age != null && age <= YOUNG_GUN_MAX_AGE && gameScore(p) >= YOUNG_GUN_GS) k.push('yng')
  if (p.tpm >= RAINMAKER_3PM) k.push('rain')
  if (p.min === 1 && blank(p)) k.push('tril')
  if (p.min >= CARDIO_MIN && blank(p)) k.push('cardio')
  return k
}

// Featured award cards: slots of awards, rarest first; a slot shows the first
// award with an eligible winner. Double Double is a game-page fallback only.
const SLOTS = [
  ['rain', 'sun', 'blk', 'stl'],
  ['cmp', 'yng', 'breakout'],
  ['bricklayer', 'cardio', 'hog', 'tril'],
]
// Among several qualifiers, the bigger number wins (then Game Score).
const RANK = {
  rain: r => r.p.tpm, sun: r => r.gs, yng: r => r.gs, blk: r => r.p.blk, stl: r => r.p.stl, ddb: r => r.gs,
  cmp: r => r.p.min, cardio: r => r.p.min, tril: r => r.gs,
}
const TIES = new Set(['rain', 'blk', 'stl']) // co-winners listed on the card

// rows: the pool (night or one game). relative: { breakout, bricklayer, hog }
// winners for this pool (null if none). skip: entries never featured again.
function featured(rows, len, relative, skip, game, date) {
  const used = new Set(skip.filter(Boolean).map(e => String(e.id)))
  const free = r => !used.has(String(r.p.id))
  const cards = []
  for (const [i, slot] of SLOTS.entries()) {
    for (const award of game && i === 0 ? [...slot, 'ddb'] : slot) {
      let card = null
      if (award in relative) {
        const e = relative[award]
        if (e && !used.has(String(e.id))) card = { award, ...e }
      } else {
        const score = RANK[award]
        const list = rows.filter(r => r.keys.includes(award) && free(r))
          .sort((a, b) => score(b) - score(a) || b.gs - a.gs)
        if (list.length) {
          card = { award, ...entry(list[0], null) }
          if (award === 'cmp') card.len = len[list[0].p.gameId]
          if (award === 'yng') card.age = ageOn(list[0].p.name, date)
          if (TIES.has(award)) card.tied = list.slice(1).filter(r => score(r) === score(list[0])).map(r => entry(r, null))
        }
      }
      if (!card) continue
      cards.push(card)
      for (const e of [card, ...(card.tied ?? [])]) used.add(String(e.id))
      break
    }
  }
  return cards
}

function entry({ p, gs, exp }, basis) {
  return {
    id: p.id, name: p.name, num: p.num, pos: p.pos, abbr: p.abbr, gameId: p.gameId,
    gs: r1(gs), exp: exp == null ? null : r1(exp), basis: exp == null ? null : basis,
    min: p.min, pts: p.pts, reb: p.reb, ast: p.ast, stl: p.stl, blk: p.blk, to: p.to,
    fgm: p.fgm, fga: p.fga, tpm: p.tpm, tpa: p.tpa, ftm: p.ftm, fta: p.fta, pm: p.pm,
  }
}
