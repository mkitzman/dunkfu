<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DateNav from '../components/DateNav.vue'
import GameCard from '../components/GameCard.vue'
import PlayerTable from '../components/PlayerTable.vue'
import Awards from '../components/Awards.vue'
import { getGames, getBoxscores, getAverages, getAwards } from '../api/index.js'
import { todayNY, addDays, dateLong, dateShort, dayTag } from '../utils.js'

const route = useRoute()
const router = useRouter()

const today = todayNY()
const date = computed(() => route.params.date || addDays(today, -1))
const isResults = computed(() => date.value < today)
const canNext = computed(() => date.value < addDays(today, 1))

const games = ref([])
const players = ref([])
const awards = ref(null)
const loading = ref(true)

let req = 0
watch(date, async d => {
  const id = ++req
  loading.value = true
  const g = await getGames(d)
  const [p, a] = d < today
    ? await Promise.all([getBoxscores(d), getAwards(d)])
    : [await getAverages(g.flatMap(x => [x.away.abbr, x.home.abbr])), null]
  if (id !== req) return
  games.value = g
  players.value = p
  awards.value = a
  loading.value = false
}, { immediate: true })

const tag = computed(() => dayTag(date.value, today))

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

const go = n => router.push(`/${addDays(date.value, n)}`)
</script>

<template>
  <div class="page">
    <DateNav
      :tag="tag"
      :title="dateLong(date)"
      :short="dateShort(date)"
      :summary="summary"
      :can-next="canNext"
      @prev="go(-1)"
      @next="canNext && go(1)"
    />

    <div class="wrap">
      <p v-if="!loading && !games.length" class="empty card">No games scheduled for {{ dateLong(date) }}.</p>

      <section v-else class="hero" :aria-busy="loading" aria-label="Games">
        <GameCard v-for="g in games" :key="g.id" :game="g" :leaders="leaders" />
      </section>

      <Awards v-if="awards?.night" :awards="awards.night" scope="night" class="awards" />

      <section v-if="players.length" class="players">
        <div class="section-head">
          <h2>{{ isResults ? 'Player stats' : 'Season averages, players in action' }}</h2>
          <span class="meta">
            {{ players.length }} players ·
            <span class="hint-desk">click a column to sort</span>
            <span class="hint-mob">tap a column to sort · swipe for more</span>
          </span>
        </div>
        <PlayerTable :players="players" :averages="!isResults" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
  padding-bottom: 28px;
}
.players { padding-bottom: 28px; }
.awards { padding-bottom: 28px; }
.empty {
  padding: 28px;
  text-align: center;
  color: var(--mu);
  font-size: 13px;
  margin: 0 0 28px;
}
.hint-mob { display: none; }

@media (max-width: 720px) {
  .hero {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 var(--gutter);
    margin: 0 calc(-1 * var(--gutter));
    padding: 12px var(--gutter) 6px;

    & > * { flex: none; width: 300px; scroll-snap-align: start; }
  }
  .players { padding-top: 14px; margin: 0 calc(-1 * var(--gutter)); }
  .section-head {
    display: block;
    padding: 0 var(--gutter);
    margin-bottom: 8px;

    & h2 { font-size: 15px; }
    & .meta { display: block; font-size: 10px; margin-top: 2px; }
  }
  .hint-desk { display: none; }
  .hint-mob { display: inline; }
}
</style>
