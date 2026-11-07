import { ref } from 'vue'

// Dark is the default whatever the OS prefers; a stored choice wins.
const KEY = 'theme'
function stored() {
  try { return localStorage.getItem(KEY) } catch { return null }
}

const theme = ref(stored() === 'light' ? 'light' : 'dark')

function apply(t) {
  theme.value = t
  document.documentElement.dataset.theme = t
}

export function useTheme() {
  function toggle() {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem(KEY, next) } catch {}
    apply(next)
  }
  return { theme, toggle }
}
