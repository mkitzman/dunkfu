<script setup>
// "Patch" award badge: solid tile, dashed stitch inset, centred glyph.
//   size: L (lists) 32px · M (desktop game log) 24px · S (mobile game log) 22px
//   surface: 'neutral' (follows the page theme) or 'team' (on team colours)
import { computed } from 'vue'
import { AWARD } from '../data/awards.js'

const props = defineProps({
  award: { type: String, required: true },
  size: { type: String, default: 'M' },
  surface: { type: String, default: 'neutral' },
  decorative: Boolean, // label is shown next to it already
})
const a = computed(() => AWARD[props.award])
const style = computed(() => (a.value.bg ? { '--b': a.value.bg, '--f': a.value.fg } : null))
</script>

<template>
  <span
    class="badge"
    :class="[`s-${size}`, a.tone && `tone-${a.tone}`, surface === 'team' && 'on-team']"
    :style="style"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : a.label"
    :aria-hidden="decorative ? 'true' : undefined"
    :title="`${a.label}: ${a.rule}`"
  ><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" aria-hidden="true" v-html="a.glyph"></svg></span>
</template>

<style scoped>
.badge {
  --sz: 24px; --r: 7px; --in: 2px; --sw: 1px; --sr: 5px; --g: 13px;
  position: relative;
  display: inline-grid;
  place-items: center;
  flex: none;
  width: var(--sz);
  height: var(--sz);
  border-radius: var(--r);
  background: var(--b);
  color: var(--f);

  /* Dashed "stitch" inset in the glyph colour at 55% */
  &::after {
    content: '';
    position: absolute;
    inset: var(--in);
    border: var(--sw) dashed color-mix(in srgb, var(--f) 55%, transparent);
    border-radius: var(--sr);
    pointer-events: none;
  }
  & svg { width: var(--g); height: var(--g); }
}
.s-L { --sz: 32px; --r: 9px; --in: 2.5px; --sw: 1.3px; --sr: 6.5px; --g: 17px; }
.s-S { --sz: 22px; --r: 6px; --in: 2px; --sw: 1px; --sr: 4.5px; --g: 12px; }

/* NBA leaders: light tile on dark surfaces, dark tile on paper. */
.tone-lead { --b: #f4f1ea; --f: #15171a; }
:global([data-theme="light"]) .tone-lead:not(.on-team) { --b: #15171a; --f: #f4f1ea; }
/* Did not play: grey, flips with the theme. */
.tone-absent { --b: #4a5058; --f: #c9ced6; }
:global([data-theme="light"]) .tone-absent:not(.on-team) { --b: #c9c2b6; --f: #4a5058; }
</style>
