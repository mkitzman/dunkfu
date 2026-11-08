import { watchEffect } from 'vue'

// Browser tab title for the current page: "<text> · dunkfu" ("dunkfu" alone
// while text is empty). Pass a function so it follows reactive data.
export function usePageTitle(text) {
  watchEffect(() => {
    const t = text()
    document.title = t ? `${t} · dunkfu` : 'dunkfu'
  })
}
