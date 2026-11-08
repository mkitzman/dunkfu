// Dates are game dates (YYYY-MM-DD) in America/New_York.

const NY = 'America/New_York'

export function todayNY() {
  if (import.meta.env.VITE_TODAY) return import.meta.env.VITE_TODAY
  return new Intl.DateTimeFormat('en-CA', { timeZone: NY, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

export function addDays(iso, n) {
  const d = new Date(iso + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export function isIsoDate(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T12:00:00Z'))
}

const fmt = (iso, opts) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', ...opts })

export const dateLong = iso => fmt(iso, { weekday: 'short', month: 'short', day: 'numeric' }) // Sat, Oct 31
export const dateShort = iso => fmt(iso, { month: 'short', day: 'numeric' }) // Oct 31
export const weekday = iso => fmt(iso, { weekday: 'long' })

export function shortName(name) {
  const parts = name.split(' ')
  return parts.length > 1 ? `${parts[0][0]}. ${parts.slice(1).join(' ')}` : name
}

export const signed = (v, digits = 0) => (v > 0 ? '+' : '') + (digits ? v.toFixed(digits) : String(v))

export const pct = (m, a) => (a ? Math.round((100 * m) / a) + '%' : '—')

// Eyebrow + heading for a game date. Yesterday/today/tomorrow lead with the
// relative name ("Last night", date above it); older nights lead with the date
// ("Wed, Nov 4", "Wednesday night" above) so a shared link reads on its own.
export function dayHeading(d, today) {
  const rel = { [addDays(today, -1)]: 'Last night', [today]: 'Tonight', [addDays(today, 1)]: 'Tomorrow' }[d]
  return rel ? { tag: dateLong(d), title: rel } : { tag: `${weekday(d)} night`, title: dateLong(d) }
}

// Full names for stat column abbreviations (header tooltips).
export const STAT_NAMES = {
  MIN: 'Minutes', PTS: 'Points', REB: 'Rebounds', AST: 'Assists', STL: 'Steals', BLK: 'Blocks',
  TOV: 'Turnovers', TO: 'Turnovers',
  FG: 'Field goals made-attempted', '3P': '3-pointers made-attempted', '3PT': '3-pointers made-attempted', FT: 'Free throws made-attempted',
  'FG%': 'Field goal percentage', '3P%': '3-point percentage', 'FT%': 'Free throw percentage',
  '+/-': 'Plus/minus (point differential while on the court)',
  W: 'Wins', L: 'Losses', PCT: 'Winning percentage', GB: 'Games behind the leader',
  HOME: 'Home record', AWAY: 'Road record', CONF: 'Conference record',
  PPG: 'Points per game', OPP: 'Opponent points per game', DIFF: 'Average point differential',
  STRK: 'Current streak', L10: 'Record in the last 10 games',
}
