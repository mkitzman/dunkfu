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
    move: r.seedPrev == null ? 0 : r.seedPrev - r.seed, // + = moved up last night
  }))
}

// Rank rows within a group and compute games behind the group leader.
export function rankGroup(list) {
  const sorted = list.slice().sort(sortStandings)
  const lead = sorted[0]
  return sorted.map((t, i) => ({ ...t, rank: i + 1, gb: (lead.w - t.w + (t.l - lead.l)) / 2 }))
}

const DIVISIONS = [['W', 'Pacific'], ['W', 'Northwest'], ['W', 'Southwest'], ['E', 'Atlantic'], ['E', 'Central'], ['E', 'Southeast']]
const CONF_NAME = { E: 'Eastern', W: 'Western' }

export function groupStandings(rows, view) {
  if (view === 'league') {
    // The 14 non-playoff teams go to the draft lottery: line above the bottom 14.
    return [{ key: 'league', title: 'League', sub: 'Conference seed in grey · lottery below the dashed line', rows: rankGroup(rows), tag: t => `${t.conference}${t.seed}`, cutAfter: t => t.rank === rows.length - 14 }]
  }
  if (view === 'division') {
    return DIVISIONS.map(([c, d]) => ({
      key: d, title: d,
      sub: `${CONF_NAME[c]} Conference`,
      rows: rankGroup(rows.filter(t => t.division === d)),
      tag: t => `${t.conference} · ${t.seed}`,
    }))
  }
  return ['W', 'E'].map(c => ({
    key: c, title: `${CONF_NAME[c]} Conference`, sub: '',
    rows: rankGroup(rows.filter(t => t.conference === c)).map(t => ({ ...t, rank: t.seed })).sort((a, b) => a.seed - b.seed),
    cutAfter: t => t.seed === 6 || t.seed === 10,
  }))
}
