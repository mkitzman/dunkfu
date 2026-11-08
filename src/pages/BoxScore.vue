<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import TeamMark from '../components/TeamMark.vue'
import LeadersRow from '../components/LeadersRow.vue'
import TeamBoxTable from '../components/TeamBoxTable.vue'
import SpotlightHero from '../components/SpotlightHero.vue'
import SpotlightDud from '../components/SpotlightDud.vue'
import PageNav from '../components/PageNav.vue'
import { getGame, getGames, getAwards } from '../api/index.js'
import { announce } from '../composables/useAnnounce.js'
import { usePageTitle } from '../composables/usePageTitle.js'
import { team } from '../data/teams.js'
import ARENAS from '../data/arenas.json'
import ARENA_MAPS from '../data/arenaMaps.js'
import { todayNY, addDays, dateLong, weekday } from '../utils.js'

const route = useRoute()
const today = todayNY()

const game = ref(null)
const dayGames = ref([])
const gameAwards = ref(null)
const loading = ref(true)

let req = 0
watch(() => route.params.id, async (id, old) => {
  const n = ++req
  loading.value = true
  const g = await getGame(id)
  const [day, a] = g ? await Promise.all([getGames(g.date), getAwards(g.date)]) : [[], null]
  if (n !== req) return
  game.value = g
  dayGames.value = day.filter(x => x.status === 'final')
  gameAwards.value = a?.games?.[id] ?? null
  loading.value = false
  if (old && g) {
    const [x, y] = sides.value
    announce(`${x.name} ${x.score}, ${y.name} ${y.score}, final. ${summary.value}`)
  }
}, { immediate: true })

// Arrows step through that night's games, in tip-off order.
const index = computed(() => dayGames.value.findIndex(g => g.id === game.value?.id))
// Eyebrow is the relative night ("Last night", "Wednesday night"), title the date.
const heading = computed(() => {
  const d = game.value.date
  const rel = { [addDays(today, -1)]: 'Last night', [today]: 'Tonight' }[d]
  return { tag: rel ?? `${weekday(d)} night`, title: dateLong(d) }
})
const gameOf = computed(() => index.value < 0 ? '' : `Game ${index.value + 1} of ${dayGames.value.length}`)

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

// "Celtics 108, Magic 97 · Nov 1"
usePageTitle(() => {
  const [a, h] = sides.value
  return a ? `${a.nick} ${a.score}, ${h.nick} ${h.score} · ${dateLong(game.value.date)}` : 'Box score'
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

// "Warriors win by 17 in OT · top scorer Luka Doncic", like the day summary.
const summary = computed(() => {
  const [a, h] = sides.value
  if (!a) return ''
  const w = a.won ? a : h, margin = Math.abs(a.score - h.score)
  const ot = nq.value > 5 ? ` in ${nq.value - 4}OT` : nq.value > 4 ? ' in OT' : ''
  const players = hasBox.value ? sides.value.flatMap(s => s.players) : []
  const top = players.reduce((x, p) => (p.pts > (x?.pts ?? -1) ? p : x), null)
  return `${w.nick} win by ${margin}${ot}` + (top ? ` · top scorer ${top.name}` : '')
})

const status = computed(() => (nq.value > 5 ? `Final/${nq.value - 4}OT` : nq.value > 4 ? 'Final/OT' : 'Final'))

const hasBox = computed(() => sides.value.length && sides.value.every(s => s.players))

// Empty rows so the shorter bench lines up with the longer one.
const benchPad = computed(() => {
  if (!hasBox.value) return [0, 0]
  const bench = sides.value.map(s => s.players.filter(p => !p.starter).length)
  const max = Math.max(...bench)
  return bench.map(b => max - b)
})

// Both teams' lines for the leader cards.
const allPlayers = computed(() => hasBox.value
  ? sides.value.flatMap(s => s.players.map(p => ({ ...p, abbr: s.abbr, color: s.color })))
  : [])
</script>

<template>
  <div class="wrap page">
    <p v-if="!loading && !game" class="missing card">Game not found. <RouterLink to="/" class="eyebrow">Back to scores</RouterLink></p>

    <template v-else-if="game">
      <PageNav
        :tag="heading.tag"
        :tag-to="`/${game.date}`"
        :title="heading.title"
        :title-to="`/${game.date}`"
        :sub="gameOf || 'All games'"
        :sub-to="`/${game.date}`"
        :sub-link="gameOf ? '· All games' : ''"
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
        <span class="wm" aria-hidden="true"></span>
        <span v-if="map" class="pin" :style="pinStyle" aria-hidden="true">
          <span v-for="i in 3" :key="i" class="ring" :style="{ animationDelay: `${(i - 1) * 2}s` }"></span>
          <span class="dot"></span>
        </span>

        <header class="strip">
          <div class="strip-l">
            <span class="final">{{ status }}</span>
            <span class="rule" aria-hidden="true"></span>
            <span class="when">{{ dateLong(game.date) }}<template v-if="gameOf"> · {{ gameOf }}</template></span>
          </div>
          <div v-if="arena" class="venue">{{ arena.name }} · {{ arena.city }}</div>
        </header>

        <div class="content">
          <div class="teams">
            <div v-for="s in sides" :key="s.abbr" class="trow" :class="{ won: s.won }">
              <TeamMark :abbr="s.abbr" :size="60" :radius="10" :font-size="16" />
              <div class="tn">
                <h2 class="name"><span class="full">{{ s.name }}</span><span class="nick">{{ s.nick }}</span></h2>
                <div class="ctx">{{ s.ctx }}</div>
              </div>
              <div class="score">{{ s.score }}</div>
            </div>
          </div>

          <div class="quarters" :style="{ '--nq': qLabels.length - 1 }" role="table" aria-label="Scoring by quarter">
            <div role="row" class="qr">
              <span role="columnheader" class="st">Q</span>
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

          <div class="map-space" aria-hidden="true"></div>
        </div>
      </section>

      <template v-if="hasBox">
        <SpotlightHero v-if="gameAwards?.performer" class="block-gap" :player="gameAwards.performer" label="Player of the Game" />

        <LeadersRow class="block" :players="allPlayers" label="Game leaders" />

        <SpotlightDud v-if="gameAwards?.dud" class="block-gap" :player="gameAwards.dud" label="Dud" />

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
  isolation: isolate;
  margin-top: 26px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, .08);
  background: var(--base);
  color: var(--fg);
  /* Arena pin sits in the empty space right of the quarter grid. */
  --pin-x: calc(100% - 80px);
}
/* Hairline texture over the map shade */
.board::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background: repeating-linear-gradient(135deg, rgba(255, 255, 255, .03) 0 1px, transparent 1px 14px);
  pointer-events: none;
}
.wm {
  position: absolute;
  left: -90px;
  bottom: -120px;
  width: 300px;
  height: 300px;
  transform: rotate(22deg);
  background: rgb(255 199 44 / .08);
  -webkit-mask: url('../assets/brand/ball-lines-thin.png') center / contain no-repeat;
  mask: url('../assets/brand/ball-lines-thin.png') center / contain no-repeat;
  pointer-events: none;
}
.strip {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, .12);
  font: 500 11px var(--mono);
  letter-spacing: .08em;
  text-transform: uppercase;
}
.strip-l { display: flex; align-items: center; gap: 10px; min-width: 0; }
.final { font-weight: 600; letter-spacing: .16em; color: #FFC72C; white-space: nowrap; }
.rule { width: 1px; height: 14px; background: rgba(255, 255, 255, .3); flex: none; }
.when { color: var(--mu); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.map {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--pin-x);
  width: 1800px;
  background: 0 50% / 1800px auto no-repeat;
}
.shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    color-mix(in srgb, var(--base) 97%, transparent) 0%,
    color-mix(in srgb, var(--base) 97%, transparent) calc(100% - 230px),
    color-mix(in srgb, var(--base) 55%, transparent) calc(100% - 140px),
    color-mix(in srgb, var(--base) 8%, transparent) 100%);
}
.pin {
  position: absolute;
  left: var(--pin-x);
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
  z-index: 1;
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 28px;
  align-items: center;
  padding: 28px 24px;
}
.map-space { min-width: 100px; }
.teams { display: grid; gap: 18px; }
.trow { display: flex; align-items: center; gap: 14px; }
.tn { width: 220px; }
.name {
  font: 600 22px/1.1 var(--sans);
  margin: 0;
  color: var(--mu);
}
.nick { display: none; }
.ctx { font-size: 12px; color: var(--mu); margin-top: 3px; }
.score {
  font: 800 64px/1 var(--sans);
  letter-spacing: -.04em;
  font-variant-numeric: tabular-nums;
  min-width: 124px;
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
  font: 400 16px var(--mono);
  font-variant-numeric: tabular-nums;
}
.qr {
  display: grid;
  grid-template-columns: 52px repeat(var(--nq), 56px) 62px;
  column-gap: 6px;
  align-items: center;

  & > span:not(:first-child) { text-align: center; }
  & > .ql { font-size: 11px; color: var(--mu); }
  & > .q { padding: 13px 0; border-radius: 5px; }
  & > .q-won { background: oklch(.42 .09 150 / var(--a)); }
  & > .q-lost { background: oklch(.42 .09 20 / var(--a)); color: var(--mu); }
  & > .q-tie { background: var(--tie); }
  & > .tot { font-weight: 600; color: var(--mu); }
  & > .tot.won { color: var(--fg); }
}
.st { font: 500 11px var(--mono); letter-spacing: .1em; color: var(--mu); }
.ab { font: 600 13px var(--sans); }

.venue {
  text-align: right;
  color: #fff;
  white-space: nowrap;
  text-shadow: 0 1px 8px rgba(0, 0, 0, .9);
}

.block { padding-top: 26px; }
.block-gap { margin-top: 26px; }
.box { container-type: inline-size; }
.pair {
  display: grid;
  grid-template-columns: 1fr 1fr;

  & > * { overflow: hidden; }
  & > :first-child { border-radius: var(--radius) 0 0 var(--radius); }
  & > :last-child { border-radius: 0 var(--radius) var(--radius) 0; }
  & > * + * { margin-left: -1px; }
}
@container (max-width: 1040px) {
  .pair { grid-template-columns: 1fr; }
  .pair > :first-child { border-radius: var(--radius) var(--radius) 0 0; }
  .pair > :last-child { border-radius: 0 0 var(--radius) var(--radius); }
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
  /* No room beside the quarter grid for the map: plain navy card. */
  .map, .pin, .map-space { display: none; }
  .shade { background: none; }
  .tn { width: 200px; }
  .score { font-size: 52px; min-width: 100px; }
}

@media (max-width: 720px) {
  .board { margin-top: 16px; }
  .strip { padding: 10px 14px; }
  .venue { display: none; }
  .wm { width: 220px; height: 220px; }
  .content {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 14px;
    --mark-size: 40px;
    --mark-r: 8px;
    --mark-fs: 12px;
  }
  .teams { gap: 12px; }
  .trow { gap: 10px; }
  .tn { width: auto; flex: 1; }
  .name { font-size: 16px; }
  .full { display: none; }
  .nick { display: inline; }
  .ctx { font-size: 10px; }
  .score { font-size: 40px; min-width: 0; }
  .quarters {
    border-left: 0;
    padding-left: 0;
    border-top: 1px solid var(--ln);
    padding-top: 10px;
    row-gap: 4px;
    font-size: 12px;
  }
  .qr { grid-template-columns: 40px repeat(calc(var(--nq) + 1), 1fr); column-gap: 4px; }
  .qr > .q { padding: 7px 0; }
  .qr > .ql { font-size: 10px; }
  .ab { font-size: 11px; }

  .block { padding-top: 18px; }
  .block-gap { margin-top: 18px; }
  .box { margin: 0 calc(-1 * var(--gutter)); }
  .pair { gap: 18px; }
  .pair > * { border-radius: 0 !important; }
  .pair > * + * { margin-top: 0; }
}
</style>
