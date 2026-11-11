<script setup>
import { computed } from 'vue'

// Seed circle: filled = playoff (1–6), dashed = play-in (7–10), plain =
// lottery (11+). Shape as well as colour, so it doesn't rely on colour alone;
// screen readers get the status as text.
const props = defineProps({
  seed: { type: Number, required: true },
  label: { type: [Number, String], default: null }, // '' = key sample (decorative)
  status: { type: String, default: null }, // overrides the spoken status (e.g. Cup "group leader")
})
const kind = computed(() => (props.seed <= 6 ? 'playoff' : props.seed <= 10 ? 'playin' : 'lottery'))
const spoken = computed(() => props.status ?? { playoff: 'playoff', playin: 'play-in', lottery: 'lottery' }[kind.value])
</script>

<template>
  <span class="seed" :class="kind" :aria-hidden="label === '' ? 'true' : undefined">{{ label ?? seed }}<span
    v-if="label !== '' && spoken" class="sr-only">, {{ spoken }}</span></span>
</template>

<style scoped>
.seed {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  flex: none;
  font: 600 11px var(--mono);
  border: 1px solid var(--ln);
  color: var(--mu);
}
.playoff { background: var(--ac); border-color: var(--ac); color: var(--bg); }
/* Dashed like the playoff / play-in cutoff line. */
.playin { border: 1.5px dashed var(--ac); color: var(--ac); }

@media (max-width: 720px) {
  .seed { width: 20px; height: 20px; font-size: 10px; }
}
</style>
