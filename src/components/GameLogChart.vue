<script setup>
// Bar per game (oldest → newest) for PTS / REB / AST, with his season average
// as a dashed line. Bars at or above average take the team colour.
import { ref, computed, useId } from 'vue'
import { slashDate } from './playerCard.js'

const props = defineProps({
  games: { type: Array, required: true }, // games he played, oldest → newest
  avg: { type: Object, required: true },
  title: { type: String, default: '' },
  barColor: { type: String, required: true },
  height: { type: Number, default: 72 },
})
const STATS = [['pts', 'PTS', 'points'], ['reb', 'REB', 'rebounds'], ['ast', 'AST', 'assists']]
const stat = ref('pts')
const id = useId()
const max = computed(() => Math.max(1, ...props.games.map(g => g[stat.value])) * 1.12)
const avgLine = computed(() => props.avg[stat.value] ?? 0)
const label = computed(() => STATS.find(s => s[0] === stat.value)[2])

function onKey(e, i) {
  const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
  if (!step) return
  e.preventDefault()
  const j = (i + step + STATS.length) % STATS.length
  stat.value = STATS[j][0]
  e.currentTarget.parentElement.children[j].focus()
}
</script>

<template>
  <div class="chart" :style="{ '--bar': barColor, '--h': `${height}px` }">
    <div class="head">
      <h4 v-if="title" class="title">{{ title }}</h4>
      <div class="tabs" role="tablist" aria-label="Chart stat">
        <button
          v-for="([k, l], i) in STATS"
          :key="k"
          type="button"
          role="tab"
          :id="`${id}-${k}`"
          :aria-selected="stat === k"
          :aria-controls="`${id}-plot`"
          :tabindex="stat === k ? 0 : -1"
          @click="stat = k"
          @keydown="onKey($event, i)"
        >{{ l }}</button>
      </div>
    </div>
    <div :id="`${id}-plot`" class="plot" role="tabpanel" :aria-labelledby="`${id}-${stat}`">
      <p class="sr-only">{{ label }} by game; season average {{ avgLine }}.</p>
      <div class="bars">
        <span class="avg" :style="{ bottom: `${(avgLine / max) * 100}%` }" aria-hidden="true"></span>
        <div v-for="g in games" :key="g.gameId" class="col">
          <span class="bar" :class="{ hi: g[stat] >= avgLine }" :style="{ height: `${(g[stat] / max) * 100}%` }">
            <span class="val">{{ g[stat] }}</span>
          </span>
          <span class="sr-only">{{ slashDate(g.date) }}: {{ g[stat] }}</span>
        </div>
      </div>
      <div class="dates" aria-hidden="true"><span v-for="g in games" :key="g.gameId">{{ slashDate(g.date) }}</span></div>
    </div>
  </div>
</template>

<style scoped>
.chart { background: var(--sf); border: 1px solid var(--ln); border-radius: 12px; padding: 14px 16px 10px; }
.head { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-bottom: 16px; }
.title { margin: 0 auto 0 0; font: 600 15px var(--sans); }
.tabs { display: flex; gap: 18px; border-bottom: 1px solid var(--ln); }
.tabs button {
  all: unset;
  cursor: pointer;
  font: 600 11px var(--mono);
  letter-spacing: .1em;
  color: var(--mu);
  padding: 4px 0 6px;
  margin-bottom: -1px;
  border-bottom: 2px solid transparent;

  &[aria-selected="true"] { color: var(--fg); border-bottom-color: var(--fg); }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; border-radius: 2px; }
}
.bars { position: relative; height: var(--h); display: flex; align-items: flex-end; gap: var(--gap, 8px); margin-top: 18px; }
/* Bars cap at 58px wide so a short season doesn't draw giant bars. */
.col { flex: 1; min-width: 0; max-width: 58px; height: 100%; display: flex; align-items: flex-end; }
.bar { position: relative; width: 100%; min-height: 2px; border-radius: 4px 4px 1px 1px; background: var(--ln); }
/* Switching PTS / REB / AST: bars grow or shrink into place, colour follows,
   and the average line glides to its new height. */
.bar { transition: height .45s cubic-bezier(.3, .7, .2, 1), background-color .3s ease; }
.avg { transition: bottom .45s cubic-bezier(.3, .7, .2, 1); }
@media (prefers-reduced-motion: reduce) {
  .bar, .avg { transition: none; }
}
.bar.hi { background: var(--bar); }
.val {
  position: absolute;
  bottom: calc(100% + 3px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  padding: 0 2px;
  border-radius: 3px;
  background: var(--sf);
  font: 500 9px var(--mono);
  color: var(--mu);
}
.avg { position: absolute; left: 0; right: 0; border-top: 1px dashed var(--mu); opacity: .6; pointer-events: none; }
.dates { display: flex; gap: var(--gap, 8px); margin-top: 6px; }
.dates span { flex: 1; min-width: 0; max-width: 58px; text-align: center; font: 400 9px var(--mono); color: var(--mu); white-space: nowrap; overflow: hidden; }
</style>
