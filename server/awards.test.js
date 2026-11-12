// Run with `npm test` (Node's built-in test runner, no dependencies).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { computeAwards } from './awards.js'
import { buildTeamLogs } from './playerLogs.js'

const ZERO = { min: 0, pts: 0, fgm: 0, fga: 0, tpm: 0, tpa: 0, ftm: 0, fta: 0, oreb: 0, dreb: 0, reb: 0, ast: 0, stl: 0, blk: 0, to: 0, pf: 0, pm: 0 }
const line = (id, s) => ({ ...ZERO, id, name: `P${id}`, abbr: 'AAA', gameId: 'g', starter: true, ...s })

// A solid starter: Game Score ~15.9 in 30 minutes.
const SOLID = { min: 30, pts: 20, fgm: 8, fga: 16, ftm: 4, fta: 4, oreb: 1, dreb: 5, ast: 5, stl: 1, pf: 2, to: 2 }
// A bad night: Game Score about -6.5 in 30 minutes.
const AWFUL = { min: 30, pts: 4, fgm: 2, fga: 12, dreb: 2, ast: 1, pf: 3, to: 3 }

// `priors` earlier nights of `before`, then tonight's line. Returns tonight's dud.
function dudAfter(priors, before, tonight) {
  const days = []
  for (let i = 0; i < priors; i++) days.push({ date: `2026-11-0${i + 1}`, lines: [line(1, before)] })
  days.push({ date: '2026-11-09', lines: [line(1, tonight)] })
  return computeAwards(days)['2026-11-09'].night.dud
}

test('a starter far below his usual night is the dud', () => {
  assert.equal(dudAfter(3, SOLID, AWFUL)?.id, 1)
})

test('a near triple-double (Game Score 15+) is never a dud', () => {
  const star = { ...SOLID, pts: 35, fgm: 13, fga: 22, ftm: 7, fta: 8, ast: 9 }
  const tripleish = { min: 36, pts: 22, fgm: 9, fga: 20, ftm: 4, fta: 4, oreb: 1, dreb: 8, ast: 11, stl: 1, pf: 2, to: 4 }
  assert.equal(dudAfter(3, star, tripleish), null)
})

test('a bench player with a low average is never the dud: no dud that night', () => {
  const bench = { ...SOLID, pts: 8, fgm: 3, fga: 8, ftm: 2, fta: 2, ast: 1 }
  assert.equal(dudAfter(3, { ...bench, starter: false }, { ...AWFUL, starter: false }), null)
})

test('fewer than 3 earlier games: never a dud', () => {
  assert.equal(dudAfter(2, SOLID, AWFUL), null)
})

test('a released player stops being marked out after 15 missed games', () => {
  const games = Array.from({ length: 30 }, (_, i) => {
    const date = `2026-${i < 20 ? '11' : '12'}-${String((i % 20) + 1).padStart(2, '0')}`
    return { id: `g${i}`, date, tipUtc: `${date}T00:00Z`, status: 'final', away: { abbr: 'AAA', score: 100 }, home: { abbr: 'BBB', score: 90 } }
  })
  const dayLines = { [games[0].date]: [line(1, { ...SOLID, gameId: 'g0' })] }
  const logs = buildTeamLogs({ dayLines, awards: {}, games, today: '2026-12-31' })
  const out = logs.AAA.players[1].games.filter(g => g.awards.includes('inj'))
  assert.equal(out.length, 15)
})
