<script setup>
// Featured award cards (night page and game page): up to three, picked on the
// server (server/awards.js, featured()); on the game page the last is the Dud of the Game. Empty slots are left
// out and the row reflows; with none, nothing renders.
import { computed } from 'vue'
import AwardCard from './AwardCard.vue'

const props = defineProps({ cards: { type: Array, default: () => [] } })

const LABEL = { pts: 'PTS', reb: 'REB', ast: 'AST', stl: 'STL', blk: 'BLK' }
const tens = p => Object.keys(LABEL).filter(k => p[k] >= 10)
// Good Day / Double Double: the double-figure stats as one number, the rest of PTS / REB / AST after.
function doubles(p) {
  const k = tens(p)
  return {
    value: k.map(x => p[x]).join('/'), unit: k.map(x => LABEL[x]).join(' / '),
    detail: ['pts', 'reb', 'ast'].filter(x => !k.includes(x)).map(x => `${p[x]} ${LABEL[x]}`).join(' · '),
  }
}
const ot = len => (len > 48 ? ` · ${len === 53 ? '' : (len - 48) / 5}OT` : '')

const CONTENT = {
  rain: p => ({ value: p.tpm, unit: '3PM', detail: `${p.tpm}/${p.tpa} 3PT` }),
  sun: doubles,
  ddb: doubles,
  blk: p => ({ value: p.blk, unit: 'BLK' }),
  stl: p => ({ value: p.stl, unit: 'STL' }),
  yng: p => ({ value: `${p.pts}/${p.reb}/${p.ast}`, unit: 'PTS / REB / AST', detail: `AGE ${p.age}` }),
  cmp: p => ({ value: p.min, unit: 'MIN', detail: `EVERY MINUTE${ot(p.len)}` }),
  breakout: p => ({ value: p.pts, unit: 'PTS', detail: p.ppg != null ? `${p.ppg.toFixed(1)} PPG AVERAGE` : '' }),
  bricklayer: p => ({
    value: `${p.ts.toFixed(1)}%`, unit: 'TRUE SHOOTING',
    unitTitle: 'True Shooting: field goals, threes and free throws combined. Under 50% is bad, 65%+ is elite.',
    detail: `${p.fgm}/${p.fga} FG · ${p.tpm}/${p.tpa} 3PT · ${p.ftm}/${p.fta} FT`,
  }),
  cardio: p => ({ value: p.min, unit: 'MIN', detail: 'NOTHING ELSE' }),
  hog: p => ({ value: p.fga, unit: 'FGA', detail: `${p.ast} AST` }),
  tril: () => ({ value: 1, unit: 'MIN', detail: '1,000,000,000,000' }),
  dudg: p => ({
    value: `${p.pts}/${p.reb}/${p.ast}`, unit: 'PTS / REB / AST',
    detail: p.exp != null ? `GAME SCORE ${p.gs.toFixed(1)}, USUAL ${p.exp.toFixed(1)}` : `GAME SCORE ${p.gs.toFixed(1)}`,
  }),
}

const shown = computed(() => props.cards
  .filter(c => CONTENT[c.award])
  .map(c => {
    const tied = c.tied ?? []
    const own = [c, ...tied].map(p => { const x = CONTENT[c.award](p); return { value: x.value, unit: x.unit } })
    // Exact ties share one big number; winners with different numbers each get their own.
    const same = own.every(o => o.value === own[0].value && o.unit === own[0].unit)
    return { award: c.award, player: c, tied, ...CONTENT[c.award](c), ...(!same && { own }) }
  }))
</script>

<template>
  <div v-if="shown.length" class="cards" :style="{ '--n': shown.length }">
    <AwardCard v-for="c in shown" :key="c.award" v-bind="c" />
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
  .cards { grid-template-columns: minmax(0, 1fr); gap: 12px; grid-auto-rows: auto; } /* stacked: each its own height */
}
</style>
