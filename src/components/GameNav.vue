<script setup>
import { computed } from 'vue'

const props = defineProps({
  tag: { type: String, required: true }, // "Last night"
  title: { type: String, required: true }, // "Sun, Nov 1"
  short: { type: String, required: true }, // "Nov 1"
  dayTo: { type: String, required: true }, // link to the day overview
  index: { type: Number, required: true }, // position of this game in the night
  total: { type: Number, required: true },
  prev: { type: Object, default: null }, // neighbouring games (same night)
  next: { type: Object, default: null },
})

const score = g => `${g.away.abbr} ${g.away.score} · ${g.home.abbr} ${g.home.score}`
const games = computed(() => `${props.total} game${props.total === 1 ? '' : 's'}`)
</script>

<template>
  <nav class="gamenav" aria-label="Games this night">
    <RouterLink v-if="prev" :to="`/game/${prev.id}`" class="side prev" :aria-label="`Previous game: ${score(prev)}`">
      <span class="arrow" aria-hidden="true">◀</span>
      <span class="txt"><span class="lbl">Prev game</span><span class="match">{{ score(prev) }}</span></span>
    </RouterLink>
    <RouterLink v-else :to="dayTo" class="side prev" aria-label="All games this night">
      <span class="arrow" aria-hidden="true">◀</span>
      <span class="txt"><span class="lbl">All games</span><span class="match">{{ short }} · {{ games }}</span></span>
    </RouterLink>

    <div class="mid">
      <div class="eyebrow">{{ tag }}</div>
      <h1 class="date">{{ title }}</h1>
      <div class="sub">
        <template v-if="total > 1">Game {{ index + 1 }} of {{ total }} · </template>
        <RouterLink :to="dayTo" class="all">All games</RouterLink>
      </div>
    </div>

    <RouterLink v-if="next" :to="`/game/${next.id}`" class="side next" :aria-label="`Next game: ${score(next)}`">
      <span class="txt"><span class="lbl">Next game</span><span class="match">{{ score(next) }}</span></span>
      <span class="arrow" aria-hidden="true">▶</span>
    </RouterLink>
    <RouterLink v-else :to="dayTo" class="side next" aria-label="All games this night">
      <span class="txt"><span class="lbl">All games</span><span class="match">{{ short }} · {{ games }}</span></span>
      <span class="arrow" aria-hidden="true">▶</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.gamenav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  padding-top: 28px;
}
.side {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px;
  border: 1px solid var(--ln);
  border-radius: 999px;
  background: var(--sf);

  &:hover { border-color: var(--mu); }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
}
.prev { justify-self: start; padding-right: 26px; }
.next { justify-self: end; padding-left: 26px; }
.arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--ln2);
  display: grid;
  place-items: center;
  font-size: 13px;
  flex: none;
}
.txt { display: grid; gap: 3px; }
.next .txt { text-align: right; }
.lbl {
  font: 500 10px var(--mono);
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--mu);
}
.match { font: 600 14px var(--mono); white-space: nowrap; }

.mid { text-align: center; }
.date {
  font: 800 36px/1.1 var(--sans);
  letter-spacing: -.03em;
  margin: 6px 0 0;
}
.sub { font-size: 13px; color: var(--mu); margin-top: 6px; }
.all { font-size: 12px; }
.all:hover { color: var(--fg); text-decoration: underline; }

@media (max-width: 860px) {
  .gamenav {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding-top: 18px;
  }
  .mid { grid-column: 1 / -1; grid-row: 1; }
  .side { gap: 8px; padding: 5px; min-width: 0; }
  .prev { padding-right: 12px; justify-self: stretch; }
  .next { padding-left: 12px; justify-self: stretch; justify-content: flex-end; }
  .txt { min-width: 0; }
  .arrow { width: 28px; height: 28px; font-size: 10px; }
  .lbl { font-size: 9px; }
  .match { font-size: 11px; overflow: hidden; text-overflow: ellipsis; }
  .date { font-size: 28px; }
}
</style>
