import { team } from '../data/teams.js'

const pctOf = t => t.w / (t.w + t.l || 1)
export const sortStandings = (a, b) => pctOf(b) - pctOf(a) || b.w - a.w || b.diff - a.diff

// Decorate raw standings rows with team info and derived fields.
export function prepare(rows) {
  return rows.map(r => ({
    ...r,
    ...team(r.abbr),
    pct: pctOf(r),
    diff: Math.round((r.ppg - r.opp) * 10) / 10,
    seedMove: r.seedPrev == null ? 0 : r.seedPrev - r.seed, // conference seed, + = moved up last night
  }))
}

// Each row's record before last night (`prev`: w, l, diff), so the League
// and Division views can show how far a team moved *within that view*. Last
// night's finals are taken back out of the record, but only when the
// standings already include the game (the game's post-game record matches);
// otherwise the team is treated as unchanged. Points averages are rolled back
// too, for the point-differential tiebreaker.
export function withPrev(rows, games) {
  const res = {}
  for (const g of games) {
    if (g.status !== 'final') continue
    for (const [s, o] of [['away', 'home'], ['home', 'away']]) {
      res[g[s].abbr] = { won: g[s].score > g[o].score, pts: g[s].score, opp: g[o].score, record: g[s].record }
    }
  }
  return rows.map(r => {
    const x = res[r.abbr]
    const n = r.w + r.l
    if (!x || x.record !== `${r.w}-${r.l}` || n < 1) return { ...r, prev: { abbr: r.abbr, w: r.w, l: r.l, diff: r.diff } }
    const m = n - 1
    const ppg = m ? (r.ppg * n - x.pts) / m : 0
    const opp = m ? (r.opp * n - x.opp) / m : 0
    // Rounded like prepare()'s diff, so unchanged teams sort exactly as today.
    return { ...r, prev: { abbr: r.abbr, w: r.w - (x.won ? 1 : 0), l: r.l - (x.won ? 0 : 1), diff: Math.round((ppg - opp) * 10) / 10 } }
  })
}

// Rank rows within a group and compute games behind the group leader. With
// `prev` records, `move` is the change in rank within this group since last
// night (+ = moved up).
export function rankGroup(list) {
  const sorted = list.slice().sort(sortStandings)
  const lead = sorted[0]
  const before = sorted.every(t => t.prev)
    ? Object.fromEntries(sorted.map(t => t.prev).sort(sortStandings).map((p, i) => [p.abbr, i + 1]))
    : null
  return sorted.map((t, i) => ({
    ...t,
    rank: i + 1,
    gb: (lead.w - t.w + (t.l - lead.l)) / 2,
    ...(before ? { move: before[t.abbr] - (i + 1) } : {}),
  }))
}

const DIVISIONS = [['W', 'Pacific'], ['W', 'Northwest'], ['W', 'Southwest'], ['E', 'Atlantic'], ['E', 'Central'], ['E', 'Southeast']]
const CONF_NAME = { E: 'Eastern', W: 'Western' }

// fav: favourite team abbr or null. Its conference (conference view) or its
// division (division view, then the rest of its conference) comes first.
export function groupStandings(rows, view, fav = null) {
  const favTeam = fav && rows.find(r => r.abbr === fav)
  if (view === 'league') {
    // The 14 non-playoff teams go to the draft lottery: line above the bottom 14.
    return [{ key: 'league', title: 'League', sub: '', rows: rankGroup(rows), tag: t => `${t.conference}${t.seed}`, cutAfter: t => t.rank === rows.length - 14 }]
  }
  if (view === 'division') {
    const divs = !favTeam ? DIVISIONS : DIVISIONS.slice().sort((a, b) =>
      (b[1] === favTeam.division) - (a[1] === favTeam.division) || (b[0] === favTeam.conference) - (a[0] === favTeam.conference))
    // confHead: the conference heading shown once, above its first division.
    return divs.map(([c, d], i) => ({
      key: d, title: d, sub: '',
      confHead: i === 0 || divs[i - 1][0] !== c ? `${CONF_NAME[c]} Conference` : null,
      rows: rankGroup(rows.filter(t => t.division === d)),
      tag: t => `${t.conference} · ${t.seed}`,
    }))
  }
  const confs = favTeam?.conference === 'E' ? ['E', 'W'] : ['W', 'E']
  return confs.map(c => ({
    key: c, title: `${CONF_NAME[c]} Conference`, sub: '',
    // Ordered by the official seed (NBA tiebreakers), so the change is the seed change.
    rows: rankGroup(rows.filter(t => t.conference === c)).map(t => ({ ...t, rank: t.seed, move: t.seedMove })).sort((a, b) => a.seed - b.seed),
    cutAfter: t => t.seed === 6 || t.seed === 10,
  }))
}
