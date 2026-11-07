<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageNav from '../components/PageNav.vue'
import GameCard from '../components/GameCard.vue'
import PlayerTable from '../components/PlayerTable.vue'
import SpotlightHero from '../components/SpotlightHero.vue'
import SpotlightDud from '../components/SpotlightDud.vue'
import ScoresPanel from '../components/ScoresPanel.vue'
import LeadersRow from '../components/LeadersRow.vue'
import DaySkeleton from '../components/DaySkeleton.vue'
import { getGames, getBoxscores, getAverages, getAwards } from '../api/index.js'
import { announce } from '../composables/useAnnounce.js'
import { todayNY, addDays, dateLong, dateShort, dayHeading } from '../utils.js'

const route = useRoute()

const today = todayNY()
const date = computed(() => route.params.date || addDays(today, -1))
const isResults = computed(() => date.value < today)
const canNext = computed(() => date.value < addDays(today, 1))

const games = ref([])
const neighbours = ref({}) // date -> game count for the prev/next pills
const players = ref([])
const awards = ref(null)
const loading = ref(true)
const loaded = ref(false) // has any day finished loading yet

let req = 0
watch(date, async (d, old) => {
  const id = ++req
  loading.value = true
  const prevD = addDays(d, -1), nextD = addDays(d, 1)
  const [g, gp, gn] = await Promise.all([getGames(d), getGames(prevD), nextD <= addDays(today, 1) ? getGames(nextD) : null])
  const [p, a] = d < today
    ? await Promise.all([getBoxscores(d), getAwards(d)])
    : [await getAverages(g.flatMap(x => [x.away.abbr, x.home.abbr])), null]
  if (id !== req) return
  games.value = g
  neighbours.value = { [prevD]: gp.length, ...(gn ? { [nextD]: gn.length } : {}) }
  players.value = p
  awards.value = a
  loading.value = false
  loaded.value = true
  if (old) announce(`${dateLong(d)}. ${summary.value}`)
}, { immediate: true })

const heading = computed(() => dayHeading(date.value, today))

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

const summary = computed(() => {
  const n = games.value.length
  if (loading.value) return ''
  if (!n) return 'No games'
  if (!isResults.value) return `${plural(n, 'game')} · all times ET · season averages below`
  const road = games.value.filter(g => g.away.score > g.home.score).length
  const top = players.value.reduce((a, b) => (b.pts > (a?.pts ?? -1) ? b : a), null)
  return `${plural(n, 'game')} · ${plural(road, 'road win')}` + (top ? ` · top scorer ${top.name}` : '')
})

// "Markkanen 26.1 PPG" per team, from season averages on schedule days.
const leaders = computed(() => {
  if (isResults.value) return {}
  const out = {}
  for (const p of players.value) {
    if (!out[p.abbr] || p.pts > out[p.abbr].pts) out[p.abbr] = p
  }
  return Object.fromEntries(Object.entries(out).map(([abbr, p]) => [abbr, `${lastName(p.name)} ${p.pts.toFixed(1)} PPG`]))
})

// "Michael Porter Jr." -> "Porter"
const lastName = name => name.split(' ').filter(w => !/^(Jr\.?|Sr\.?|II|III|IV)$/.test(w)).pop()

// Prev/next day pills: "OCT 30 · 8 games". Next is disabled past tomorrow.
function dayPill(step) {
  const d = addDays(date.value, step)
  if (step > 0 && !canNext.value) return { disabled: true, label: dateShort(d), text: '\u00a0' }
  const n = neighbours.value[d]
  return {
    to: d === addDays(today, -1) ? '/' : `/${d}`,
    label: dateShort(d),
    text: n == null ? '' : n ? plural(n, 'game') : 'No games',
    aria: `${step < 0 ? 'Previous' : 'Next'} day: ${dateLong(d)}`,
  }
}
</script>

<template>
  <div class="page">
    <PageNav
      class="wrap nav"
      :tag="heading.tag"
      :title="heading.title"
      :sub="summary"
      :prev="dayPill(-1)"
      :next="dayPill(1)"
    />

    <div class="wrap">
      <!-- First load only; switching days keeps the current day up until the next arrives. -->
      <DaySkeleton v-if="!loaded" />

      <p v-else-if="!loading && !games.length" class="empty card">No games scheduled for {{ dateLong(date) }}.</p>

      <ScoresPanel v-else class="block" :date="date" :final="isResults" :count="games.length" :aria-busy="loading">
        <GameCard v-for="g in games" :key="g.id" :game="g" :leaders="leaders" />
      </ScoresPanel>

      <template v-if="isResults && awards?.night">
        <SpotlightHero
          v-if="awards.night.performer"
          class="block"
          :player="awards.night.performer"
          label="Player of the Night"
          :to="`/game/${awards.night.performer.gameId}`"
        />
      </template>

      <LeadersRow v-if="isResults && players.length" class="block" :players="players" label="Leaders of the night" />

      <template v-if="isResults && awards?.night">
        <SpotlightDud
          v-if="awards.night.dud"
          class="block"
          :player="awards.night.dud"
          label="Dud of the Night"
          :to="`/game/${awards.night.dud.gameId}`"
        />
      </template>

      <section v-if="players.length" class="players">
        <div v-if="!isResults" class="section-head">
          <h2>Season averages, players in action</h2>
        </div>
        <PlayerTable :players="players" :averages="!isResults" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.nav { margin-bottom: 26px; }
.block { margin-bottom: 26px; }
.players { padding-bottom: 48px; }
.empty {
  padding: 28px;
  text-align: center;
  color: var(--mu);
  font-size: 13px;
  margin: 0 0 28px;
}

@media (max-width: 720px) {
  .nav { margin-bottom: 16px; }
  .block { margin-bottom: 16px; }
  .players { padding-top: 6px; margin: 0 calc(-1 * var(--gutter)); }
  .section-head {
    display: block;
    padding: 0 var(--gutter);
    margin-bottom: 8px;

    & h2 { font-size: 15px; }
    & .meta { display: block; font-size: 10px; margin-top: 2px; }
  }
}
</style>
