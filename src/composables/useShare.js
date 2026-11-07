import { announce } from './useAnnounce.js'

// Native share sheet where available, otherwise copy the link.
export async function share({ title, text, url = location.href }) {
  if (navigator.share) {
    try { await navigator.share({ title, text, url }) } catch { /* dismissed */ }
    return
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`)
    announce('Link copied')
    return 'copied'
  } catch {
    return null
  }
}
