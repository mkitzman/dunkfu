<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  games: { type: Array, required: true }, // finals on the date
  currentId: { type: String, required: true },
})

const strip = ref(null)

const status = g => {
  const n = g.away.quarters?.length ?? 4
  return n > 5 ? `F/${n - 4}OT` : n > 4 ? 'F/OT' : 'F'
}

// Keep the current game's pill centered under the date.
function center() {
  const s = strip.value
  const cur = s?.querySelector('[data-current]')
  if (!cur) return
  const sr = s.getBoundingClientRect(), cr = cur.getBoundingClientRect()
  s.scrollLeft += cr.left + cr.width / 2 - (sr.left + sr.width / 2)
}

onMounted(() => {
  center()
  document.fonts?.ready.then(center)
  window.addEventListener('resize', center)
})
onBeforeUnmount(() => window.removeEventListener('resize', center))
watch(() => [props.currentId, props.games.length], () => nextTick(center))
</script>

<template>
  <nav ref="strip" class="games" aria-label="Other games this day">
    <RouterLink
      v-for="g in games"
      :key="g.id"
      :to="`/game/${g.id}`"
      class="pill"
      :data-current="g.id === currentId ? '' : undefined"
      :aria-current="g.id === currentId ? 'page' : undefined"
    >
      <span class="score">
        <span :class="{ won: g.away.score > g.home.score }">{{ g.away.abbr }} {{ g.away.score }}</span>
        <span class="dot">·</span>
        <span :class="{ won: g.home.score > g.away.score }">{{ g.home.abbr }} {{ g.home.score }}</span>
      </span>
      <span class="st">{{ status(g) }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.games {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 2px 50% 0;
  scroll-snap-type: x mandatory;
  mask-image: linear-gradient(90deg, transparent, #000 48px, #000 calc(100% - 48px), transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 48px, #000 calc(100% - 48px), transparent);

  &::-webkit-scrollbar { display: none; }
}
.pill {
  flex: none;
  scroll-snap-align: center;
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--sf);
  border: 1px solid var(--ln);

  &:hover, &[data-current] { border-color: var(--mu); }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 1px; }
}
.score {
  display: flex;
  gap: 5px;
  align-items: baseline;
  font: 600 11px var(--mono);
  letter-spacing: .02em;
  color: var(--mu);

  & .won { color: var(--fg); }
  & .dot { color: var(--ln); font-weight: 400; }
}
.st { font: 500 9px var(--mono); letter-spacing: .08em; color: var(--mu); }
</style>
