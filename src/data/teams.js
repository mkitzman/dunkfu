import TEAMS from './teams.json'

const byAbbr = Object.fromEntries(
  TEAMS.map(t => [t.abbr, {
    abbr: t.abbr, city: t.city, nick: t.nickname, name: `${t.city} ${t.nickname}`,
    conference: t.conference, division: t.division, color: t.seedColor, secondary: t.secondary,
    jersey: t.jersey ?? null, // optional { body, trim, text } when the uniform differs from the brand colours
    accentOverride: t.accent ?? null, // optional: use instead of the secondary as the site's accent
  }]),
)

export const teams = Object.values(byAbbr)

export function team(abbr) {
  return byAbbr[abbr]
}

// Text color for a team-color block: white or near-black, whichever reads
// better; pure black when neither reaches 4.5:1 (mid reds like #E03A3E).
export function onColor(hex) {
  const best = contrast(hex, '#ffffff') >= contrast(hex, '#15171a') ? '#ffffff' : '#15171a'
  return contrast(hex, best) >= 4.5 ? best : '#000000'
}

// WCAG contrast helpers for team colors used as text (team chips).
const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
const lum = hex => {
  const [r, g, b] = rgb(hex).map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
const mix = (a, b, t) => '#' + rgb(a).map((v, i) => Math.round(v * (1 - t) + rgb(b)[i] * t).toString(16).padStart(2, '0')).join('')

// Nudge a color toward black (or white) until it reads at 4.5:1 on bg.
function readable(hex, bg, toward) {
  for (let t = 0; t <= 1; t += 0.05) {
    const c = mix(hex, toward, t)
    if (contrast(c, bg) >= 4.5) return c
  }
  return toward
}

// CSS variables for a .team-chip: light (paper --sf) and dark theme versions.
export function chipStyle(hex) {
  return { '--team': readable(hex, '#fbf8f2', '#000000'), '--team-dark': `color-mix(in oklch, ${hex} 55%, #fff)` }
}

// Accent for text and trim on a team-colour background (spotlight hero,
// jersey, favourite highlight): the team's `accent` override if set (e.g.
// MIA white: yellow is a brand colour they rarely wear), else the secondary,
// or white when that is near-black or near-navy (POR, HOU, UTA, PHX...).
export function accent(abbr) {
  const t = team(abbr)
  if (t?.accentOverride) return t.accentOverride
  const s = t?.secondary
  return s && lum(s) >= 0.04 ? s : '#ffffff'
}

// Multiply a hex colour's channels by f (0..1).
export function darken(hex, f) {
  return '#' + rgb(hex).map(v => Math.round(v * f).toString(16).padStart(2, '0')).join('')
}

export const alpha = (hex, a) => `rgb(${rgb(hex).join(' ')} / ${a})`
