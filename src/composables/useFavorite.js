import { ref } from 'vue'
import { team, chipStyle } from '../data/teams.js'

// The viewer's favourite team (abbr or null for "None"), kept in
// localStorage. Its games, players and standings row are highlighted in team
// colours, and its conference/division is listed first in the standings.
const KEY = 'favTeam'

function read() {
  try {
    const v = localStorage.getItem(KEY)
    return team(v) ? v : null
  } catch {
    return null
  }
}

export const favorite = ref(read())

export function setFavorite(abbr) {
  favorite.value = team(abbr) ? abbr : null
  try {
    if (favorite.value) localStorage.setItem(KEY, favorite.value)
    else localStorage.removeItem(KEY)
  } catch { /* private mode: lasts for this visit */ }
}

// Another tab changed it.
window.addEventListener('storage', e => {
  if (e.key === KEY) favorite.value = read()
})

export const isFav = abbr => !!favorite.value && abbr === favorite.value

// CSS variables for a highlighted row/entry on --sf: --tc tints the
// background, --team/--team-dark colour the star (readable, like .team-chip).
export function favStyle(abbr) {
  const c = team(abbr)?.color ?? '#646a72'
  return { '--tc': c, ...chipStyle(c) }
}
