<script setup>
// "?" button that opens a small panel (slot) below it. Closes on Escape,
// an outside click or a second press.
import { ref, nextTick, onBeforeUnmount, useId } from 'vue'

defineProps({ label: { type: String, default: 'Help' } })

const open = ref(false)
const root = ref(null)
const btn = ref(null)
const panel = ref(null)
const shift = ref(0) // px left, to keep the panel on screen
const id = useId()

function onDoc(e) {
  if (!root.value?.contains(e.target)) close()
}
function onKey(e) {
  if (e.key === 'Escape') { close(); btn.value?.focus() }
}
function close() {
  open.value = false
  document.removeEventListener('pointerdown', onDoc)
  document.removeEventListener('keydown', onKey)
}
function toggle() {
  if (open.value) return close()
  open.value = true
  shift.value = 0
  nextTick(() => {
    const r = panel.value.getBoundingClientRect()
    const over = r.right - (document.documentElement.clientWidth - 12)
    if (over > 0) shift.value = Math.min(over, r.left - 12)
  })
  document.addEventListener('pointerdown', onDoc)
  document.addEventListener('keydown', onKey)
}
onBeforeUnmount(close)
</script>

<template>
  <span ref="root" class="help">
    <button
      ref="btn"
      type="button"
      class="q"
      :aria-label="label"
      :aria-expanded="open"
      :aria-controls="id"
      @click="toggle"
    >?</button>
    <div v-show="open" ref="panel" :id="id" class="panel" :style="{ '--shift': `${shift}px`, transform: shift ? `translateX(${-shift}px)` : null }" role="region" :aria-label="label">
      <slot />
    </div>
  </span>
</template>

<style scoped>
.help { position: relative; display: inline-flex; vertical-align: middle; }
.q {
  width: 20px;
  height: 20px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--ln);
  background: transparent;
  color: var(--mu);
  font: 600 11px/1 var(--sans);
  display: grid;
  place-items: center;
  cursor: pointer;

  &:hover, &[aria-expanded="true"] { color: var(--fg); border-color: var(--mu); }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
}
/* Bigger tap target without a bigger circle */
@media (pointer: coarse) {
  .q { position: relative; }
  .q::after { content: ''; position: absolute; inset: -12px; }
}
.panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  z-index: 10;
  width: max-content;
  max-width: calc(100vw - 2 * var(--gutter));
  padding: 14px 16px;
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .25);
  text-align: left;

  /* Notch pointing up at the button (moves with any on-screen shift). */
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: calc(10px - 5px + var(--shift, 0px));
    width: 10px;
    height: 10px;
    background: var(--sf);
    border-left: 1px solid var(--ln);
    border-top: 1px solid var(--ln);
    transform: rotate(45deg);
  }
}
</style>
