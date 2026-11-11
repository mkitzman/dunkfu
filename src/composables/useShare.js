import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { announce } from './useAnnounce.js'

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
const touch = matchMedia('(pointer: coarse)').matches

// Share a spotlight card as an image.
//
// The card renders an off-screen copy of itself (`prep` true → its <Teleport>
// mounts, `frame` points at it), which is captured to a PNG. Capturing costs
// a few hundred ms of main thread and most visitors never share, so it only
// happens once someone heads for the card: `prime()` on pointer enter, focus
// or touch. Safari only allows navigator.share() straight from a tap, so the
// image should be ready by the click; if a quick tap beats it, the click
// waits for it and, if Safari then refuses, asks for a second tap.
//
//   key()   changes when the card shows someone else (re-render)
//   meta()  { title, text, filename }
//   enabled false for the off-screen copy itself
export function useShareImage(key, meta, enabled = true) {
  const prep = ref(false)
  const frame = ref(null)
  const status = ref('') // '', 'Copied image', 'Copied link'
  let file = null
  let pending = null // render in progress (or done) for the current card
  let run = 0
  let timer

  function prime() {
    if (enabled && !pending) pending = render()
    return pending
  }

  async function render() {
    const id = ++run
    file = null
    await document.fonts?.ready
    if (id !== run) return
    prep.value = true
    await nextTick()
    try {
      const { domToBlob } = await import('modern-screenshot')
      const opts = { scale: 2, type: 'image/png' }
      // Safari can miss fonts/images on the first pass.
      if (isSafari) await domToBlob(frame.value, opts)
      const blob = await domToBlob(frame.value, opts)
      if (id === run && blob) file = new File([blob], meta().filename, { type: 'image/png' })
    } catch (e) {
      console.warn('Share image failed', e)
    } finally {
      if (id === run) prep.value = false
    }
  }

  // Someone else on the card: drop the old image; the next prime() renders.
  watch(key, () => { run++; file = null; pending = null; prep.value = false })
  onBeforeUnmount(() => { run++; clearTimeout(timer) })

  function flash(msg) {
    status.value = msg
    announce(msg)
    clearTimeout(timer)
    timer = setTimeout(() => (status.value = ''), 1800)
  }

  async function share() {
    if (!file) await prime()
    const { title, text } = meta()
    const url = location.href
    const canShareFile = file && navigator.canShare?.({ files: [file] })
    const shareFile = async () => {
      try {
        await navigator.share({ files: [file], title, text: `${text} ${url}` })
      } catch (e) {
        // The wait for the image outlasted the tap; it's ready now.
        if (e?.name === 'NotAllowedError') flash('Tap again to share')
      }
    }
    // 1. Phones: share sheet with the image.
    if (canShareFile && touch) return shareFile()
    // 2. Desktop: copy just the image. (The macOS share sheet's Copy puts it
    //    on the clipboard twice, so Slack etc. paste two attachments.)
    if (file && window.ClipboardItem && navigator.clipboard?.write) {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': file })])
        return flash('Copied image')
      } catch { /* fall through */ }
    }
    if (canShareFile) return shareFile()
    // 3. Link only.
    if (navigator.share) {
      try { await navigator.share({ title, text, url }) } catch { /* dismissed */ }
      return
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`)
      flash('Copied link')
    } catch { /* nothing more to try */ }
  }

  return { prep, frame, status, share, prime }
}
