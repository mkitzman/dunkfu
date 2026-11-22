<script setup>
// Click-to-open "toggletip": a button that opens a small panel (slot).
// Built on the native popover API, so the panel sits in the top layer (never
// clipped by a scrolling table or the player card dialog) and closes on
// Escape, an outside click or a second press for free. Opens on click / tap /
// Enter only, never on hover, so it works the same with touch and keyboard.
//
//   default slot  panel content
//   trigger slot  what the button shows (default: a "?" circle)
import { ref, useId, onBeforeUnmount } from 'vue'

defineProps({ label: { type: String, default: 'Help' } }) // button + panel name

const id = useId()
const btn = ref(null)
const panel = ref(null)
const open = ref(false)
const pos = ref({})

const GAP = 10, EDGE = 12

function place() {
  const b = btn.value.getBoundingClientRect()
  const p = panel.value.getBoundingClientRect()
  const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight
  const left = Math.max(EDGE, Math.min(b.left, vw - p.width - EDGE))
  const below = b.bottom + GAP + p.height <= vh - EDGE || b.top - GAP - p.height < EDGE
  pos.value = {
    left: `${left}px`,
    top: `${below ? b.bottom + GAP : b.top - GAP - p.height}px`,
    '--notch': `${Math.min(Math.max(b.left + Math.min(b.width, 20) / 2 - left, 12), p.width - 12)}px`,
  }
  panel.value.dataset.side = below ? 'below' : 'above'
}

// The panel is fixed to the viewport; close it rather than let it drift.
const hide = () => panel.value?.hidePopover?.()
function onToggle(e) {
  open.value = e.newState === 'open'
  if (open.value) {
    place()
    addEventListener('scroll', hide, { capture: true, passive: true })
    addEventListener('resize', hide)
  } else {
    delete panel.value.dataset.side
    removeEventListener('scroll', hide, { capture: true })
    removeEventListener('resize', hide)
  }
}
onBeforeUnmount(() => { removeEventListener('scroll', hide, { capture: true }); removeEventListener('resize', hide) })
</script>

<template>
  <span class="help">
    <button
      ref="btn"
      type="button"
      :class="$slots.trigger ? 'trig' : 'q'"
      :aria-label="label"
      :aria-expanded="open"
      :aria-controls="id"
      :popovertarget="id"
    ><slot name="trigger">?</slot></button>
    <div :id="id" ref="panel" popover="auto" class="panel" :style="pos" role="region" :aria-label="label" @toggle="onToggle">
      <slot />
    </div>
  </span>
</template>

<style scoped>
.help { display: inline-flex; vertical-align: middle; }
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
}
/* Custom trigger (e.g. an award badge stack): no chrome of its own. */
.trig {
  display: inline-flex;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  border-radius: 8px;
}
.q:focus-visible, .trig:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
/* Bigger tap target without a bigger circle */
@media (pointer: coarse) {
  .q { position: relative; }
  .q::after { content: ''; position: absolute; inset: -12px; }
}
.panel {
  position: fixed;
  inset: auto;
  margin: 0;
  overflow: visible;
  width: max-content;
  max-width: min(340px, calc(100vw - 24px));
  padding: 14px 16px;
  background: var(--sf);
  color: var(--fg);
  border: 1px solid var(--ln);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .25);
  text-align: left;
  white-space: normal;

  /* Hidden until placed next to the button (toggle fires after the first paint). */
  &:not([data-side]) { visibility: hidden; }

  /* Notch pointing at the button. */
  &::before {
    content: '';
    position: absolute;
    left: calc(var(--notch, 16px) - 5px);
    width: 10px;
    height: 10px;
    background: var(--sf);
    transform: rotate(45deg);
  }
  &[data-side="below"]::before { top: -6px; border-left: 1px solid var(--ln); border-top: 1px solid var(--ln); }
  &[data-side="above"]::before { bottom: -6px; border-right: 1px solid var(--ln); border-bottom: 1px solid var(--ln); }
}
</style>
