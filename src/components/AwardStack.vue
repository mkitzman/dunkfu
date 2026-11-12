<script setup>
// Overlapping award badges for a game line; the most important (first) on top.
import AwardBadge from './AwardBadge.vue'
defineProps({
  awards: { type: Array, required: true }, // award keys in display order
  size: { type: String, default: 'M' },
})
</script>

<template>
  <span v-if="awards.length" class="stack">
    <AwardBadge
      v-for="(k, i) in awards"
      :key="k"
      :award="k"
      :size="size"
      class="b"
      :style="{ zIndex: awards.length - i }"
    />
  </span>
  <span v-else class="none" aria-label="No awards">—</span>
</template>

<style scoped>
.stack { display: inline-flex; align-items: center; vertical-align: middle; }
.b { box-shadow: 0 0 0 2px var(--ring, var(--sf)); }
.b + .b { margin-left: -6px; }
.none { color: var(--mu); }
</style>
