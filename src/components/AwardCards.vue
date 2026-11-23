<script setup>
// The night's award cards (night overview only), in the fixed order
// Breakout, Bricklayer, Ball Hawk, Rim Protector. Cards whose award nobody
// won (Ball Hawk / Rim Protector need 5+) are left out and the row reflows.
import { computed } from 'vue'
import AwardCard from './AwardCard.vue'

const props = defineProps({ night: { type: Object, required: true } })

const cards = computed(() => {
  const n = props.night
  const b = n.bricklayer
  return [
    n.breakout && {
      award: 'breakout', player: n.breakout, value: n.breakout.pts, unit: 'PTS',
      detail: n.breakout.ppg != null ? `${n.breakout.ppg.toFixed(1)} PPG AVERAGE` : '',
    },
    b && {
      award: 'bricklayer', player: b, value: `${b.ts.toFixed(1)}%`, unit: 'TRUE SHOOTING',
      unitTitle: 'True Shooting: field goals, threes and free throws combined. Under 50% is bad, 65%+ is elite.',
      detail: `${b.fgm}/${b.fga} FG · ${b.tpm}/${b.tpa} 3PT · ${b.ftm}/${b.fta} FT`,
    },
    n.ballHawk && { award: 'stl', player: n.ballHawk, tied: n.ballHawk.tied, value: n.ballHawk.stl, unit: 'STL' },
    n.rimProtector && { award: 'blk', player: n.rimProtector, tied: n.rimProtector.tied, value: n.rimProtector.blk, unit: 'BLK' },
  ].filter(Boolean)
})
</script>

<template>
  <div v-if="cards.length" class="cards" :style="{ '--n': cards.length }">
    <AwardCard v-for="c in cards" :key="c.award" v-bind="c" />
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(var(--n), minmax(0, 1fr));
  gap: 14px;
  grid-auto-rows: 1fr; /* every card as tall as the tallest (e.g. a tie listing several players) */
}
@media (max-width: 1040px) {
  .cards { grid-template-columns: repeat(min(var(--n), 2), minmax(0, 1fr)); }
}
/* Phones: one per row, so names and the Bricklayer shooting line fit. */
@media (max-width: 560px) {
  .cards { grid-template-columns: minmax(0, 1fr); gap: 12px; }
}
</style>
