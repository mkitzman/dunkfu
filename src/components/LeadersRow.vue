<script setup>
// Points / Rebounds / Assists leader cards: top 3 per category from a list of
// player lines (one game on the box score, every game on the day overview).
import { computed } from 'vue'
import LeaderCard from './LeaderCard.vue'
import { team } from '../data/teams.js'
import { shortName } from '../utils.js'

const props = defineProps({
  players: { type: Array, required: true }, // lines with abbr, name, num, min, pts, reb, ast, fg/ft, dreb/oreb, to|tov
  label: { type: String, default: 'Leaders' },
})

const tov = p => p.to ?? p.tov
const CATS = [
  ['Points', 'pts', p => `${p.fgm}/${p.fga} FG, ${p.ftm}/${p.fta} FT`],
  ['Rebounds', 'reb', p => `${p.dreb} DREB, ${p.oreb} OREB`],
  ['Assists', 'ast', p => `${tov(p)} TO, ${p.min} MIN`],
]

// Ties go to more minutes.
const cards = computed(() => CATS.map(([label, key, sub]) => ({
  label,
  list: props.players.slice().sort((a, b) => b[key] - a[key] || b.min - a.min).slice(0, 3).map(p => {
    const color = p.color ?? team(p.abbr)?.color ?? '#646a72'
    return { key: `${p.abbr}-${p.name}`, name: p.name, short: shortName(p.name), num: p.num, abbr: p.abbr, color, value: p[key], sub: sub(p) }
  }),
})))
</script>

<template>
  <section :aria-label="label">
    <div class="leaders">
      <LeaderCard v-for="c in cards" :key="c.label" :label="c.label" :leaders="c.list" />
    </div>
  </section>
</template>

<style scoped>
.leaders {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

@media (max-width: 1040px) {
  .leaders { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .leaders {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 var(--gutter);
    margin: 0 calc(-1 * var(--gutter));
    padding: 0 var(--gutter) 6px;
  }
  .leaders > * { flex: none; width: 300px; scroll-snap-align: start; }
}
</style>
