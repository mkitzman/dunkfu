import { shallowRef } from 'vue'

// The player card (one <dialog>, mounted in App.vue). openPlayer() remembers
// the element that opened it so closing returns focus there.
//   player: { id, abbr, name, num?, pos? }
export const cardPlayer = shallowRef(null)
let trigger = null

export function openPlayer(player, el) {
  trigger = el ?? document.activeElement
  cardPlayer.value = player
}

export function closePlayer() {
  cardPlayer.value = null
  const t = trigger
  trigger = null
  if (t?.isConnected) t.focus({ preventScroll: true })
}
