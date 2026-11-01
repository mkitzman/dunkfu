import TEAMS from './teams.json'

const byAbbr = Object.fromEntries(
  TEAMS.map(t => [t.abbr, { abbr: t.abbr, city: t.city, nick: t.nickname, name: `${t.city} ${t.nickname}`, conference: t.conference, division: t.division, color: t.seedColor }]),
)

export const teams = Object.values(byAbbr)

export function team(abbr) {
  return byAbbr[abbr]
}

// Text color for a team-color block (README contrast rule).
export function onColor(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? '#15171a' : '#fff'
}
