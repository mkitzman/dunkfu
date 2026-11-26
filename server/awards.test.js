// Run with `npm test` (Node's built-in test runner, no dependencies).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { computeAwards } from './awards.js'
import { buildTeamLogs, nightPlayerAwards } from './playerLogs.js'

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

test('10+ rebounds is never a dud, however poor the shooting', () => {
  // Naz Reid, Nov 20: 12/10/3 on 4-19, Game Score 0.4
  assert.equal(dudAfter(3, SOLID, { ...AWFUL, min: 39, pts: 12, fgm: 4, fga: 19, ftm: 2, fta: 4, reb: 10, dreb: 10, ast: 3, pf: 5 }), null)
})

test('Player of the Night is the highest Game Score, whoever usually plays better', () => {
  const days = [1, 2, 3].map(i => ({ date: `2026-11-0${i}`, lines: [line(1, { ...SOLID, pts: 40, fgm: 15, fga: 25 }), line(2, { ...SOLID, pts: 6, fgm: 2, fga: 8 })] }))
  days.push({ date: '2026-11-09', lines: [line(1, { ...SOLID, pts: 32, fgm: 12, fga: 20 }), line(2, { ...SOLID, pts: 30, fgm: 11, fga: 20 })] })
  assert.equal(computeAwards(days)['2026-11-09'].night.performer.id, 1)
})

test('Breakout is the biggest jump over his usual, never the Player of the Night', () => {
  const star = { ...SOLID, pts: 40, fgm: 15, fga: 25 }, role = { ...SOLID, pts: 6, fgm: 2, fga: 8 }
  const days = [1, 2, 3].map(i => ({ date: `2026-11-0${i}`, lines: [line(1, star), line(2, role), line(3, role)] }))
  // Star jumps most but is Player of the Night; player 2's jump beats player 3's.
  days.push({ date: '2026-11-09', lines: [line(1, { ...star, pts: 70, fgm: 27 }), line(2, { ...role, pts: 30, fgm: 12, fga: 18 }), line(3, { ...role, pts: 16, fgm: 6, fga: 12 })] })
  const night = computeAwards(days)['2026-11-09'].night
  assert.equal(night.performer.id, 1)
  assert.equal(night.breakout.id, 2)
  assert.equal(night.breakout.ppg, 6) // his average before tonight
})

test('Bricklayer counts field goal and free throw misses; ties go to the worse shooter', () => {
  const lines = [
    line(1, { ...SOLID, pts: 11, fgm: 5, fga: 15, ftm: 0, fta: 2 }), // 12 misses, TS 34.6%
    line(2, { ...SOLID, pts: 20, fgm: 8, fga: 18, ftm: 3, fta: 5 }), // 12 misses, TS 49.5%
    line(3, { ...SOLID, fgm: 2, fga: 12, ftm: 4, fta: 4 }), // 10 misses
  ]
  const b = computeAwards([{ date: '2026-11-09', lines }])['2026-11-09'].night.bricklayer
  assert.equal(b.id, 1)
  assert.equal(b.missed, 12)
  assert.equal(b.ts, 34.6) // 11 / (2 × (15 + 0.44 × 2))
})

const cards = (lines, date = '2026-11-09') => computeAwards([{ date, lines }])[date].night.cards
const card = (lines, award) => cards(lines).find(c => c.award === award)

test('Ball Hawk needs 5+ steals; nobody qualifying means no card', () => {
  assert.equal(card([line(1, { ...SOLID, stl: 4 }), line(2, SOLID)], 'stl'), undefined)
  // Player 2 (6 steals) is also Player of the Night, so player 3 is featured.
  const l = [line(1, SOLID), line(2, { ...SOLID, pts: 30, stl: 6 }), line(3, { ...SOLID, stl: 5 })]
  assert.equal(card(l, 'stl').id, 3)
})

test('the day table gets each player\'s awards, same rules as the game log', () => {
  const lines = [line(1, { ...SOLID, pts: 40, fgm: 15, fga: 25, blk: 5 }), line(2, { ...SOLID, reb: 14 }), line(3, SOLID)]
  const aw = computeAwards([{ date: '2026-11-09', lines }])['2026-11-09']
  assert.deepEqual(nightPlayerAwards(lines, aw), { 1: ['potn', 'potg', 'pts', 'ast', 'blk'], 2: ['reb', 'ast', 'ddb'], 3: ['ast'] })
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

test('the day table marks the Dud of the Game as well as the Dud of the Night', () => {
  const days = [1, 2, 3].map(i => ({ date: `2026-11-0${i}`, lines: [line(1, SOLID), line(2, SOLID)] }))
  const tonight = [line(1, AWFUL), line(2, SOLID)]
  days.push({ date: '2026-11-09', lines: tonight })
  const aw = computeAwards(days)['2026-11-09']
  assert.deepEqual(nightPlayerAwards(tonight, aw)[1].filter(k => k.startsWith('dud')), ['dud', 'dudg'])
})

test('Ball Hawk ties: the leader on Game Score, the rest listed as tied', () => {
  const lines = [line(9, { ...SOLID, pts: 50, fgm: 20 }), line(1, { ...SOLID, stl: 5 }), line(2, { ...SOLID, pts: 30, fgm: 12, stl: 5 }), line(3, { ...SOLID, stl: 5, pts: 10, fgm: 3 }), line(4, { ...SOLID, stl: 4 })]
  const hawk = card(lines, 'stl')
  assert.equal(hawk.id, 2)
  assert.deepEqual(hawk.tied.map(t => t.id), [1, 3])
})

test('Bricklayer skips efficient volume: 41 points on 65.8% TS loses to 5-19', () => {
  const lines = [
    line(1, { ...SOLID, pts: 41, fgm: 13, fga: 25, tpm: 6, tpa: 15, ftm: 9, fta: 14 }), // Tatum, 17 misses
    line(2, { ...SOLID, pts: 11, fgm: 5, fga: 19, ftm: 0, fta: 0 }), // Irving, 14 misses
  ]
  assert.equal(computeAwards([{ date: '2026-11-24', lines }])['2026-11-24'].night.bricklayer.id, 2)
})

test('featured slots: rarest award first, nobody featured twice', () => {
  const lines = [
    line(1, { ...SOLID, pts: 45, fgm: 17 }), // Player of the Night
    line(2, { ...SOLID, pts: 33, fgm: 11, fga: 20, tpm: 9, tpa: 14, blk: 5 }), // Rainmaker beats Rim Protector
    line(3, { ...SOLID, pts: 6, fgm: 2, fga: 17, ast: 1 }), // Bricklayer (also a Ball Hog)
    line(4, { ...SOLID, min: 6, pts: 0, fgm: 0, fga: 0, ftm: 0, fta: 0, oreb: 0, dreb: 0, ast: 0, stl: 0, pf: 0, to: 0 }), // Cardio Day
  ]
  assert.deepEqual(cards(lines).map(c => [c.award, c.id]), [['rain', 2], ['bricklayer', 3]])
})

test('the Dud of the Night is never featured again: Bricklayer goes to the next award', () => {
  const blank = { min: 6, pts: 0, fgm: 0, fga: 0, ftm: 0, fta: 0, oreb: 0, dreb: 0, ast: 0, stl: 0, pf: 0, to: 0 }
  const days = [1, 2, 3].map(i => ({ date: `2026-11-0${i}`, lines: [line(1, SOLID), line(2, SOLID)] }))
  const brick = { ...AWFUL, fga: 20, fta: 4 } // the dud, and the most misses
  days.push({ date: '2026-11-09', lines: [line(1, brick), line(2, SOLID), line(3, blank)] })
  const night = computeAwards(days)['2026-11-09'].night
  assert.equal(night.dud.id, 1)
  assert.equal(night.bricklayer.id, 1)
  assert.deepEqual(night.cards.filter(c => c.award !== 'breakout').map(c => [c.award, c.id]), [['cardio', 3]])
})

test('a foul breaks a Trillionaire; 1 minute of nothing earns it', () => {
  const tril = { min: 1, pts: 0, fgm: 0, fga: 0, ftm: 0, fta: 0, oreb: 0, dreb: 0, ast: 0, stl: 0, pf: 0, to: 0 }
  const lines = [line(1, SOLID), line(2, tril), line(3, { ...tril, pf: 1 })]
  const aw = computeAwards([{ date: '2026-11-09', lines }])['2026-11-09']
  const got = nightPlayerAwards(lines, aw)
  assert.deepEqual(got[2], ['tril'])
  assert.equal(got[3], undefined)
})

test('Completionist: every minute, overtime included', () => {
  // Two teams of 265 minutes: one overtime, 53 minutes.
  const team = (abbr, first, min) => [line(first, { abbr, min }), ...[1, 2, 3, 4].map(i => line(first + i, { abbr, min: (265 - min) / 4 }))]
  const lines = [...team('AAA', 1, 53), ...team('BBB', 10, 48)]
  const aw = computeAwards([{ date: '2026-11-09', lines }])['2026-11-09']
  assert.equal(aw.games.g.len, 53)
  const got = nightPlayerAwards(lines, aw)
  assert.ok(got[1]?.includes('cmp'))
  assert.ok(!got[10]?.includes('cmp'))
})

test('game page: Double Double fills slot 1; one-a-night awards only if their winner played here', () => {
  const g = (id, s, gameId) => ({ ...line(id, s), gameId })
  const lines = [
    g(1, { ...SOLID, pts: 40, fgm: 15 }, 'a'), g(2, { ...SOLID, reb: 12 }, 'a'), g(3, { ...SOLID, reb: 11, pts: 14, fgm: 5 }, 'a'),
    g(4, { ...SOLID, pts: 2, fgm: 1, fga: 18 }, 'b'), g(5, SOLID, 'b'), // Bricklayer plays in game b
  ]
  const aw = computeAwards([{ date: '2026-11-09', lines }])['2026-11-09']
  // Player 1 is Player of the Game; player 2 has the better Double Double.
  assert.deepEqual(aw.games.a.cards.map(c => [c.award, c.id]), [['ddb', 2]])
  assert.ok(!aw.night.cards.some(c => c.award === 'ddb'))
  assert.ok(aw.games.b.cards.some(c => c.award === 'bricklayer' && c.id === 4))
})

test('Young Gun: a big game (Game Score 22+) at 20 or under; 15/2/2 is not enough', () => {
  const big = { ...SOLID, pts: 33, fgm: 13, fga: 19, ftm: 5, fta: 6 } // Game Score ~26
  const lines = [{ ...line(1, big), name: 'Cooper Flagg' }, { ...line(2, { ...SOLID, pts: 15, fgm: 6, fga: 12, ftm: 3, fta: 4, ast: 2, dreb: 1 }), name: 'Dylan Harper' }, line(3, big)]
  const got = nightPlayerAwards(lines, computeAwards([{ date: '2026-11-09', lines }])['2026-11-09'], '2026-11-09')
  assert.ok(got[1].includes('yng'))
  assert.ok(!got[2]?.includes('yng'))
  assert.ok(!got[3].includes('yng')) // not on the list
  // Thomas Sorber turns 21 on 2026-12-25.
  const sorber = [{ ...line(1, big), name: 'Thomas Sorber' }]
  const on = d => nightPlayerAwards(sorber, computeAwards([{ date: d, lines: sorber }])[d], d)[1]
  assert.ok(on('2026-12-24').includes('yng'))
  assert.ok(!on('2026-12-25').includes('yng'))
})
