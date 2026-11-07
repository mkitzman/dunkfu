<script setup>
// Navy panel holding the night's game cards (slot), with a header strip:
// FINAL SCORES / SCHEDULE · date · count | ALL TIMES ET.
import { dateLong } from '../utils.js'

defineProps({
  date: { type: String, required: true },
  final: Boolean,
  count: { type: Number, required: true },
})
</script>

<template>
  <section class="panel" :aria-label="final ? 'Final scores' : 'Schedule'">
    <header class="strip">
      <div class="l">
        <h2 class="label">{{ final ? 'Final scores' : 'Schedule' }}</h2>
        <span class="rule" aria-hidden="true"></span>
        <span class="meta">{{ dateLong(date) }} · {{ count }} {{ count === 1 ? 'game' : 'games' }}</span>
      </div>
      <span class="meta tz">All times ET</span>
    </header>
    <div class="grid">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.panel {
  --fg: #f4f6f9;
  --mu: #c9d2df;
  --ln: rgba(255, 255, 255, .16);
  --ln2: rgba(255, 255, 255, .06);
  --sf: rgba(255, 255, 255, .06);
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, .08);
  color: var(--fg);
  background:
    radial-gradient(70% 90% at 100% 0%, rgba(255, 255, 255, .07), transparent 60%),
    repeating-linear-gradient(135deg, rgba(255, 255, 255, .03) 0 1px, transparent 1px 14px),
    #0e2440;

  /* Thin-line ball watermark, brand orange */
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    right: -120px;
    bottom: -160px;
    width: 460px;
    height: 460px;
    transform: rotate(18deg);
    background: rgb(242 107 33 / .09);
    -webkit-mask: url('../assets/brand/ball-lines-thin.png') center / contain no-repeat;
    mask: url('../assets/brand/ball-lines-thin.png') center / contain no-repeat;
    pointer-events: none;
  }
}
.strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, .12);
}
.l { display: flex; align-items: center; gap: 10px; min-width: 0; }
.label {
  margin: 0;
  font: 600 11px var(--mono);
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--brand);
  white-space: nowrap;
}
.rule { width: 1px; height: 14px; background: rgba(255, 255, 255, .3); flex: none; }
.meta {
  font: 500 11px var(--mono);
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--mu);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
  padding: 16px;
}

@media (max-width: 720px) {
  .strip { padding: 10px 14px; }
  .tz { display: none; }
  /* Swipeable row of cards, as before the panel existed. */
  .grid {
    display: flex;
    gap: 10px;
    padding: 12px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 12px;
  }
  .grid > :deep(*) { flex: none; width: 280px; scroll-snap-align: start; }
}
</style>
