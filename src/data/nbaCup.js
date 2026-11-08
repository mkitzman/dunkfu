// Emirates NBA Cup group play: the Highlightly API doesn't mark Cup games or
// carry Cup standings, so they're worked out from the regular games we
// already have. A game counts when it's on a Cup Night between two teams in
// the same group. Update once a season (groups are drawn each summer).
//
// 2026-27: Cup Nights are Fridays Oct 30 – Nov 27 plus Tue Nov 24 and
// Wed Nov 25 (NBA announcement, Aug 12 2026). Each team plays the other four
// in its group once; the six group winners and one wild card per conference
// reach the knockout rounds.
export const CUP = {
  season: 2027, // named by the ending year, like the standings pipeline
  nights: ['2026-10-30', '2026-11-06', '2026-11-13', '2026-11-20', '2026-11-24', '2026-11-25', '2026-11-27'],
  groups: {
    E: { A: ['DET', 'ORL', 'TOR', 'MIL', 'BKN'], B: ['CLE', 'MIA', 'PHI', 'NYK', 'IND'], C: ['BOS', 'ATL', 'WAS', 'CHI', 'CHA'] },
    W: { A: ['DAL', 'DEN', 'HOU', 'PHX', 'UTA'], B: ['MIN', 'OKC', 'NOP', 'LAC', 'MEM'], C: ['GSW', 'SAS', 'LAL', 'POR', 'SAC'] },
  },
}

const groupOf = Object.fromEntries(
  Object.entries(CUP.groups).flatMap(([conf, gs]) => Object.entries(gs).flatMap(([g, teams]) => teams.map(t => [t, `${conf}${g}`]))),
)

// Cup games among a list of games (any dates; non-Cup nights are skipped).
export function cupGames(games) {
  const nights = new Set(CUP.nights)
  return games.filter(g =>
    g.status === 'final' && nights.has(g.date) && groupOf[g.away.abbr] && groupOf[g.away.abbr] === groupOf[g.home.abbr])
}

// Group tables from Cup games: { 'EA': [row…], … } with rows ranked by the Cup
// tiebreakers (record; head-to-head among the tied teams; point differential;
// points scored). Row: abbr, w, l, pct (null at 0-0), gb, home, away, pf, pa, diff, streak, rank.
export function cupTables(games) {
  const recs = {}
  for (const t of Object.keys(groupOf)) recs[t] = { abbr: t, w: 0, l: 0, hw: 0, hl: 0, aw: 0, al: 0, pf: 0, pa: 0, seq: [], vs: {} }
  for (const g of games.slice().sort((a, b) => (a.date < b.date ? -1 : 1))) {
    for (const [side, other, home] of [['away', 'home', false], ['home', 'away', true]]) {
      const r = recs[g[side].abbr]
      const won = g[side].score > g[other].score
      r[won ? 'w' : 'l']++
      r[(home ? 'h' : 'a') + (won ? 'w' : 'l')]++
      r.pf += g[side].score
      r.pa += g[other].score
      r.seq.push(won ? 'W' : 'L')
      const v = (r.vs[g[other].abbr] ??= { w: 0, l: 0 })
      v[won ? 'w' : 'l']++
    }
  }
  const pct = r => (r.w + r.l ? r.w / (r.w + r.l) : 0.5) // 0-0 sits between 1-0 and 0-1

  const out = {}
  for (const [conf, gs] of Object.entries(CUP.groups)) {
    for (const [g, teams] of Object.entries(gs)) {
      const rows = teams.map(t => recs[t])
      rows.sort((a, b) => {
        const d = pct(b) - pct(a)
        if (d) return d
        // Head-to-head among every team on this record.
        const tied = rows.filter(r => pct(r) === pct(a)).map(r => r.abbr)
        const h2h = r => tied.reduce((s, t) => s + (r.vs[t]?.w ?? 0) - (r.vs[t]?.l ?? 0), 0)
        return h2h(b) - h2h(a) || (b.pf - b.pa) - (a.pf - a.pa) || b.pf - a.pf
      })
      const lead = rows[0]
      out[`${conf}${g}`] = rows.map((r, i) => {
        let n = 0
        while (n < r.seq.length && r.seq[r.seq.length - 1 - n] === r.seq[r.seq.length - 1]) n++
        return {
          abbr: r.abbr, w: r.w, l: r.l, rank: i + 1,
          pct: r.w + r.l ? r.w / (r.w + r.l) : null, // null: no Cup games yet
          gb: (lead.w - r.w + (r.l - lead.l)) / 2,
          home: `${r.hw}-${r.hl}`, away: `${r.aw}-${r.al}`,
          pf: r.pf, pa: r.pa, diff: r.pf - r.pa,
          streak: n ? `${r.seq[r.seq.length - 1]}${n}` : '—',
        }
      })
    }
  }
  return out
}
