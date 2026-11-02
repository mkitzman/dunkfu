<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import TeamMark from '../components/TeamMark.vue'
import LeaderCard from '../components/LeaderCard.vue'
import TeamBoxTable from '../components/TeamBoxTable.vue'
import Awards from '../components/Awards.vue'
import PageNav from '../components/PageNav.vue'
import { getGame, getGames, getAwards } from '../api/index.js'
import { team } from '../data/teams.js'
import ARENAS from '../data/arenas.json'
import ARENA_MAPS from '../data/arenaMaps.js'
import { todayNY, dateLong, dayTag, weekday, shortName } from '../utils.js'

const route = useRoute()
const today = todayNY()

const game = ref(null)
const dayGames = ref([])
const gameAwards = ref(null)
const loading = ref(true)

let req = 0
watch(() => route.params.id, async id => {
  const n = ++req
  loading.value = true
  const g = await getGame(id)
  const [day, a] = g ? await Promise.all([getGames(g.date), getAwards(g.date)]) : [[], null]
  if (n !== req) return
  game.value = g
  dayGames.value = day.filter(x => x.status === 'final')
  gameAwards.value = a?.games?.[id] ?? null
  loading.value = false
}, { immediate: true })

// Arrows step through that night's games, in tip-off order.
const index = computed(() => dayGames.value.findIndex(g => g.id === game.value?.id))
const navTag = computed(() => {
  const t = dayTag(game.value.date, today)
  return /night|tonight|tomorrow/i.test(t) ? t : `${weekday(game.value.date)} night`
})

// The night's games as a carousel: prev/next wrap around the ends. With only
// two games a single pill shows (next on the first game, prev on the second).
const score = g => `${g.away.abbr} ${g.away.score} · ${g.home.abbr} ${g.home.score}`
function navPill(step) {
  const n = dayGames.value.length, i = index.value
  if (i < 0 || n < 2) return null
  if (n === 2 && (step > 0) !== (i === 0)) return null
  const g = dayGames.value[(i + step + n) % n]
  return { to: `/game/${g.id}`, label: step < 0 ? 'Prev game' : 'Next game', text: score(g), aria: `${step < 0 ? 'Previous' : 'Next'} game: ${score(g)}` }
}

const sides = computed(() => {
  const g = game.value
  if (!g) return []
  const awayWon = g.away.score > g.home.score
  return [
    { ...g.away, ...team(g.away.abbr), won: awayWon, ctx: `${g.away.record}, ${g.away.split} Away` },
    { ...g.home, ...team(g.home.abbr), won: !awayWon, ctx: `${g.home.record}, ${g.home.split} Home` },
  ]
})

// Arena and map art come from config by home team (neutral-site games will
// show the home team's arena). No map record: plain navy card, no pin.
const arena = computed(() => game.value && ARENAS[game.value.home.abbr])
const map = computed(() => game.value && ARENA_MAPS[game.value.home.abbr])
const MAP_W = 1800
const mapStyle = computed(() => map.value && {
  backgroundImage: `url(${map.value.src})`,
  marginLeft: `${-map.value.focal.x * MAP_W}px`,
})
const pinStyle = computed(() => map.value && {
  '--pin': map.value.pin,
  top: `calc(50% + ${(map.value.focal.y - 0.5) * MAP_W * map.value.aspect}px)`,
})

const nq = computed(() => game.value?.away.quarters?.length ?? 4)
const qLabels = computed(() => {
  const l = ['1', '2', '3', '4']
  for (let i = 4; i < nq.value; i++) l.push(i === 4 ? 'OT' : `${i - 3}OT`)
  return l.concat('T')
})

// Quarter heat map: tint strength scales with the margin, full at 15+.
function heat(margin) {
  const title = margin > 0 ? `Won the quarter by ${margin}` : margin < 0 ? `Lost the quarter by ${-margin}` : 'Even quarter'
  if (margin === 0) return { class: 'q q-tie', title }
  const a = Math.min(1, Math.abs(margin) / 15)
  return { class: ['q', margin > 0 ? 'q-won' : 'q-lost'], style: { '--a': (0.2 + 0.8 * a).toFixed(2) }, title }
}

const status = computed(() => (nq.value > 5 ? `FINAL/${nq.value - 4}OT` : nq.value > 4 ? 'FINAL/OT' : 'FINAL'))

const hasBox = computed(() => sides.value.length && sides.value.every(s => s.players))

// Empty rows so the shorter bench lines up with the longer one.
const benchPad = computed(() => {
  if (!hasBox.value) return [0, 0]
  const bench = sides.value.map(s => s.players.filter(p => !p.starter).length)
  const max = Math.max(...bench)
  return bench.map(b => max - b)
})

const CATS = [
  ['Points', 'pts', p => `${p.fgm}/${p.fga} FG, ${p.ftm}/${p.fta} FT`],
  ['Rebounds', 'reb', p => `${p.dreb} DREB, ${p.oreb} OREB`],
  ['Assists', 'ast', p => `${p.to} TO, ${p.min} MIN`],
]

// Top 3 across both teams per category; ties go to more minutes.
const leaders = computed(() => {
  if (!hasBox.value) return []
  const all = sides.value.flatMap(s => s.players.map(p => ({ ...p, abbr: s.abbr, color: s.color })))
  return CATS.map(([label, key, sub]) => ({
    label,
    list: all.slice().sort((a, b) => b[key] - a[key] || b.min - a.min).slice(0, 3).map(p => ({
      key: `${p.abbr}-${p.name}`, name: p.name, short: shortName(p.name), num: p.num, abbr: p.abbr, color: p.color, value: p[key], sub: sub(p),
    })),
  }))
})
</script>

<template>
  <div class="wrap page">
    <p v-if="!loading && !game" class="missing card">Game not found. <RouterLink to="/" class="eyebrow">Back to scores</RouterLink></p>

    <template v-else-if="game">
      <PageNav
        :tag="navTag"
        :tag-to="`/${game.date}`"
        :title="dateLong(game.date)"
        :sub="dayGames.length > 1 && index >= 0 ? `Game ${index + 1} of ${dayGames.length}` : ''"
        :prev="navPill(-1)"
        :next="navPill(1)"
      />

      <section
        class="board"
        :style="{ '--base': map?.baseColor ?? '#0e2440' }"
        :aria-label="`${sides[0].name} ${sides[0].score}, ${sides[1].name} ${sides[1].score}, final`"
      >
        <div v-if="map" class="map" :style="mapStyle" aria-hidden="true"></div>
        <div class="shade" aria-hidden="true"></div>
        <span v-if="map" class="pin" :style="pinStyle" aria-hidden="true">
          <span v-for="i in 3" :key="i" class="ring" :style="{ animationDelay: `${(i - 1) * 2}s` }"></span>
          <span class="dot"></span>
        </span>

        <div class="content">
          <div class="teams">
            <div v-for="s in sides" :key="s.abbr" class="trow" :class="{ won: s.won }">
              <TeamMark :abbr="s.abbr" :size="44" :radius="8" :font-size="13" />
              <div class="tn">
                <h1 class="name"><span class="full">{{ s.name }}</span><span class="nick">{{ s.nick }}</span></h1>
                <div class="ctx">{{ s.ctx }}</div>
              </div>
              <div class="score">{{ s.score }}</div>
            </div>
          </div>

          <div class="quarters" :style="{ '--nq': qLabels.length - 1 }" role="table" aria-label="Scoring by quarter">
            <div role="row" class="qr">
              <span role="columnheader" class="st">{{ status }}</span>
              <span v-for="l in qLabels" :key="l" role="columnheader" class="ql">{{ l }}</span>
            </div>
            <div v-for="(s, si) in sides" :key="s.abbr" role="row" class="qr">
              <span role="rowheader" class="ab">{{ s.abbr }}</span>
              <span
                v-for="(q, i) in s.quarters"
                :key="i"
                role="cell"
                v-bind="heat(q - sides[1 - si].quarters[i])"
              >{{ q }}</span>
              <span role="cell" class="tot" :class="{ won: s.won }">{{ s.score }}</span>
            </div>
          </div>

          <div v-if="arena" class="venue">{{ arena.name }}<br><span>{{ arena.city }}, {{ arena.state }}</span></div>
        </div>
      </section>

      <template v-if="hasBox">
        <Awards v-if="gameAwards" :awards="gameAwards" scope="game" class="block" />

        <section class="block" aria-label="Game leaders">
          <div class="leaders">
            <LeaderCard v-for="c in leaders" :key="c.label" :label="c.label" :leaders="c.list" />
          </div>
        </section>

        <section class="block box" aria-label="Box score">
          <div class="pair">
            <TeamBoxTable v-for="(s, i) in sides" :key="s.abbr" :team="s" :players="s.players" :pad="benchPad[i]" />
          </div>
        </section>
      </template>

      <p v-else class="missing card">The full box score for this game isn't available yet.</p>
    </template>
  </div>
</template>

<style scoped>
.page { padding-bottom: 48px; }

/* Scoreboard: navy card with the arena map showing through on the right. */
.board {
  --fg: #f4f6f9;
  --mu: #c9d2df;
  --ln: rgba(255, 255, 255, .18);
  --tie: rgba(255, 255, 255, .12);
  position: relative;
  overflow: hidden;
  margin-top: 22px;
  border-radius: 8px;
  background: var(--base);
  color: var(--fg);
}
.map {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 84%;
  width: 1800px;
  background: 0 50% / 1800px auto no-repeat;
}
.shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    color-mix(in srgb, var(--base) 97%, transparent) 0%,
    color-mix(in srgb, var(--base) 97%, transparent) 58%,
    color-mix(in srgb, var(--base) 55%, transparent) 72%,
    color-mix(in srgb, var(--base) 8%, transparent) 100%);
}
.pin {
  position: absolute;
  left: 84%;
  width: 0;
  height: 0;

  & .dot {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--pin);
    border: 2px solid #fff;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--pin) 30%, transparent), 0 0 0 1px rgba(0, 0, 0, .25);
  }
  & .ring {
    position: absolute;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1.5px solid color-mix(in srgb, var(--pin) 80%, transparent);
    transform: translate(-50%, -50%) scale(.3);
    opacity: 0;
    animation: ping 6s cubic-bezier(.2, .6, .4, 1) infinite;
    pointer-events: none;
  }
}
@keyframes ping {
  0% { transform: translate(-50%, -50%) scale(.3); opacity: .7; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .pin .ring { display: none; }
}

.content {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 28px;
  align-items: center;
  padding: 20px 24px;
}
.teams { display: grid; gap: 14px; }
.trow { display: flex; align-items: center; gap: 12px; }
.tn { width: 200px; }
.name {
  font: 600 17px/1.1 var(--sans);
  margin: 0;
  color: var(--mu);
}
.nick { display: none; }
.ctx { font-size: 11px; color: var(--mu); margin-top: 2px; }
.score {
  font: 800 40px/1 var(--sans);
  letter-spacing: -.04em;
  font-variant-numeric: tabular-nums;
  min-width: 84px;
  text-align: right;
  margin-left: auto;
  color: var(--mu);
}
.trow.won .name, .trow.won .score { color: var(--fg); }

.quarters {
  border-left: 1px solid var(--ln);
  padding-left: 28px;
  display: grid;
  row-gap: 8px;
  font: 400 14px var(--mono);
  font-variant-numeric: tabular-nums;
}
.qr {
  display: grid;
  grid-template-columns: 52px repeat(var(--nq), 48px) 54px;
  column-gap: 6px;
  align-items: center;

  & > span:not(:first-child) { text-align: center; }
  & > .ql { font-size: 11px; color: var(--mu); }
  & > .q { padding: 9px 0; border-radius: 5px; }
  & > .q-won { background: oklch(.42 .09 150 / var(--a)); }
  & > .q-lost { background: oklch(.42 .09 20 / var(--a)); color: var(--mu); }
  & > .q-tie { background: var(--tie); }
  & > .tot { font-weight: 600; color: var(--mu); }
  & > .tot.won { color: var(--fg); }
}
.st { font: 500 11px var(--mono); letter-spacing: .1em; color: var(--mu); }
.ab { font: 600 13px var(--sans); }

.venue {
  align-self: end;
  min-width: 180px;
  text-align: right;
  font: 500 11px/1.7 var(--mono);
  color: #fff;
  text-shadow: 0 1px 8px rgba(0, 0, 0, .9);

  & span { opacity: .75; }
}

.block { padding-top: 26px; }
.box { container-type: inline-size; }
.leaders {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.pair {
  display: grid;
  grid-template-columns: 1fr 1fr;

  & > * { overflow: hidden; }
  & > :first-child { border-radius: 8px 0 0 8px; }
  & > :last-child { border-radius: 0 8px 8px 0; }
  & > * + * { margin-left: -1px; }
}
@container (max-width: 1040px) {
  .pair { grid-template-columns: 1fr; }
  .pair > :first-child { border-radius: 8px 8px 0 0; }
  .pair > :last-child { border-radius: 0 0 8px 8px; }
  .pair > * + * { margin-left: 0; margin-top: -1px; }
}

.missing {
  margin: 28px 0 0;
  padding: 28px;
  text-align: center;
  color: var(--mu);
  font-size: 13px;
}

@media (max-width: 1040px) {
  .content { grid-template-columns: 1fr auto; }
  .venue { display: none; }
  .leaders { grid-template-columns: 1fr; }
}

@media (max-width: 720px) {
  .board { margin-top: 16px; }
  .map, .pin { display: none; }
  .shade { background: none; }
  .content {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 14px;
    --mark-size: 34px;
    --mark-r: 6px;
    --mark-fs: 11px;
  }
  .teams { gap: 10px; }
  .trow { gap: 10px; }
  .tn { width: auto; flex: 1; }
  .name { font-size: 14px; }
  .full { display: none; }
  .nick { display: inline; }
  .ctx { font-size: 10px; }
  .score { font-size: 30px; min-width: 0; }
  .quarters {
    border-left: 0;
    padding-left: 0;
    border-top: 1px solid var(--ln);
    padding-top: 10px;
    row-gap: 4px;
    font-size: 12px;
  }
  .qr { grid-template-columns: 40px repeat(calc(var(--nq) + 1), 1fr); column-gap: 4px; }
  .qr > .q { padding: 6px 0; }
  .st { font-size: 0; }
  .qr > .ql { font-size: 10px; }
  .ab { font-size: 11px; }

  .block { padding-top: 18px; }
  .leaders {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 var(--gutter);
    margin: 0 calc(-1 * var(--gutter));
    padding: 0 var(--gutter) 6px;

    & > * { flex: none; width: 300px; scroll-snap-align: start; }
  }
  .box { margin: 0 calc(-1 * var(--gutter)); }
  .pair { gap: 18px; }
  .pair > * { border-radius: 0 !important; }
  .pair > * + * { margin-top: 0; }
}
</style>
