import { ref } from 'vue'

const KEY = 'theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')
const stored = () => {
  const t = localStorage.getItem(KEY)
  return t === 'light' || t === 'dark' ? t : null
}

const theme = ref(stored() ?? (media.matches ? 'dark' : 'light'))

function apply(t) {
  theme.value = t
  document.documentElement.dataset.theme = t
}

// Follow the system until the user picks a theme.
media.addEventListener('change', e => {
  if (!stored()) apply(e.matches ? 'dark' : 'light')
})

export function useTheme() {
  function toggle() {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem(KEY, next)
    apply(next)
  }
  return { theme, toggle }
}
