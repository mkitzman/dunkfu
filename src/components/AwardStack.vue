<script setup>
// Overlapping award badges for a game line; the most important (first) on top.
// The whole stack is one button (a bigger target than any single badge) that
// opens a panel naming each award and its rule; click / tap / Enter only.
import { computed } from 'vue'
import AwardBadge from './AwardBadge.vue'
import HelpPopover from './HelpPopover.vue'
import { AWARD } from '../data/awards.js'

const props = defineProps({
  awards: { type: Array, required: true }, // award keys in display order
  size: { type: String, default: 'M' },
})
const label = computed(() => `Awards: ${props.awards.map(k => AWARD[k].label).join(', ')}`)
</script>

<template>
  <HelpPopover v-if="awards.length" :label="label" class="stack-pop">
    <template #trigger>
      <span class="stack">
        <AwardBadge
          v-for="(k, i) in awards"
          :key="k"
          :award="k"
          :size="size"
          decorative
          class="b"
          :style="{ zIndex: awards.length - i }"
        />
      </span>
    </template>
    <ul class="list">
      <li v-for="k in awards" :key="k">
        <AwardBadge :award="k" size="M" decorative />
        <span><b>{{ AWARD[k].label }}</b><span class="rule">{{ AWARD[k].rule }}</span></span>
      </li>
    </ul>
  </HelpPopover>
  <span v-else class="none" :class="`s-${size}`" aria-label="No awards">—</span>
</template>

<style scoped>
.stack { display: inline-flex; align-items: center; vertical-align: middle; }
.b { box-shadow: 0 0 0 2px var(--ring, var(--sf)); }
.b + .b { margin-left: -6px; }
/* Same width as a badge, so the dash centres on the first badge's spot. */
.none { display: inline-block; width: 24px; text-align: center; color: var(--mu); vertical-align: middle; }
.none.s-S { width: 22px; }
.none.s-L { width: 32px; }

.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.list li { display: grid; grid-template-columns: 24px 1fr; gap: 10px; align-items: center; }
.list b { display: block; font: 600 13px/1.25 var(--sans); white-space: nowrap; }
.rule { display: block; font: 400 11px/1.35 var(--mono); color: var(--mu); margin-top: 1px; }
</style>
