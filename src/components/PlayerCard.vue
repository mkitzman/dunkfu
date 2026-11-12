<script setup>
// Player card (rev 5): a native <dialog> opened with showModal(), so focus is
// trapped, the page behind is inert and Escape closes it; focus returns to
// the name that opened it. Desktop: team column + game log. Below 760px: a
// full-screen sheet with a pinned bar and Game log / Awards / Bio tabs.
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, useId } from 'vue'
import { cardPlayer, closePlayer } from '../composables/usePlayerCard.js'
import { getTeamLog, getPlayerBio } from '../api/index.js'
import { team, accent, darken, alpha } from '../data/teams.js'
import { useTheme } from '../composables/useTheme.js'
import JerseyMark from './JerseyMark.vue'
import StatTrio from './StatTrio.vue'
import AwardsList from './AwardsList.vue'
import VitalsList from './VitalsList.vue'
import GameLogChart from './GameLogChart.vue'
import GameLogTable from './GameLogTable.vue'
import { summarize, vitals, seasonLabel } from './playerCard.js'

const dlg = ref(null)
const scroller = ref(null)
const heroName = ref(null)
const id = useId()
const { theme } = useTheme()

const p = computed(() => cardPlayer.value)
const t = computed(() => (p.value ? team(p.value.abbr) : null))

// Phone layout below 760px.
const mq = window.matchMedia('(max-width: 759px)')
const mobile = ref(mq.matches)
const onMq = e => (mobile.value = e.matches)

const log = ref(null) // { player, upcoming } | null
const bio = ref(null)
const status = ref('idle') // idle | loading | ready | missing
const bioStatus = ref('idle') // idle | loading | ready | failed
const tab = ref('log')
const compact = ref(false) // mobile: name scrolled under the bar

let req = 0
watch(cardPlayer, async (pl, old) => {
  if (!pl) {
    if (dlg.value?.open) dlg.value.close()
    return
  }
  const n = ++req
  tab.value = 'log'
  compact.value = false
  log.value = null
  bio.value = null
  status.value = 'loading'
  bioStatus.value = 'loading'
  await nextTick()
  if (!dlg.value.open) dlg.value.showModal()
  document.documentElement.classList.add('modal-open')
  if (!old) dlg.value.scrollTop = 0

  const file = await getTeamLog(pl.abbr)
  if (n !== req) return
  const player = file?.players?.[pl.id] ?? null
  log.value = player ? { player, upcoming: file.upcoming ?? [] } : null
  status.value = player ? 'ready' : 'missing'

  const b = await getPlayerBio(pl.id, player?.gp ?? 0)
  if (n !== req) return
  bio.value = b && !b.error ? b : null
  bioStatus.value = bio.value ? 'ready' : 'failed'
})

function onClose() {
  document.documentElement.classList.remove('modal-open')
  req++
  closePlayer()
}
function close() {
  dlg.value?.close()
}
// Click on the backdrop (the dialog element itself, outside the panel).
function onClick(e) {
  if (e.target === dlg.value && !mobile.value) close()
}

const s = computed(() => summarize(log.value?.player))
const season = seasonLabel()
const name = computed(() => log.value?.player.name ?? p.value?.name ?? '')
const num = computed(() => log.value?.player.num ?? p.value?.num ?? '')
const pos = computed(() => bio.value?.positionAbbr || log.value?.player.pos || p.value?.pos || '')
const rows = computed(() => vitals(bio.value, log.value?.player ?? p.value))
const chartGames = computed(() => s.value.played.slice(-15))

// Team colours: the team column / mobile header always use them.
const teamStyle = computed(() => {
  const c = t.value?.color ?? '#3a3f46'
  const sec = accent(p.value?.abbr)
  return {
    '--tc': c,
    '--sec': sec,
    '--tgrad': `linear-gradient(160deg, ${darken(c, 0.5)} 0%, ${c} 55%, color-mix(in srgb, ${c} 82%, #fff) 100%)`,
    '--wm': alpha(sec, 0.09),
  }
})
const jersey = computed(() => ({
  color: t.value?.jersey?.body ?? t.value?.color ?? '#3a3f46',
  trim: t.value?.jersey?.trim ?? accent(p.value?.abbr),
  text: t.value?.jersey?.text ?? accent(p.value?.abbr),
}))
// Chart bars: team colour, lifted on dark pages; very dark teams use their accent.
const barColor = computed(() => {
  const c = t.value?.color ?? '#646a72'
  const dark = theme.value === 'dark'
  const n = parseInt(c.slice(1), 16), lum = (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255
  if (dark) return lum < 0.12 ? accent(p.value?.abbr) : `color-mix(in oklch, ${c} 72%, #fff)`
  return lum > 0.6 ? darken(c, 0.6) : c
})

// Mobile: fade the compact title in once the big name has scrolled under the bar.
let io
watch([mobile, () => heroName.value], () => {
  io?.disconnect()
  if (!mobile.value || !heroName.value || !scroller.value) return
  io = new IntersectionObserver(([e]) => { compact.value = !e.isIntersecting }, { root: scroller.value, rootMargin: '-64px 0px 0px 0px' })
  io.observe(heroName.value)
}, { flush: 'post' })

const TABS = [['log', 'Game log'], ['awards', 'Awards'], ['bio', 'Bio']]
function onTabKey(e, i) {
  const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
  if (!step) return
  e.preventDefault()
  const j = (i + step + TABS.length) % TABS.length
  tab.value = TABS[j][0]
  e.currentTarget.parentElement.children[j].focus()
}

async function share() {
  const data = { title: `${name.value} · dunkfu`, text: `${name.value} on dunkfu`, url: location.href }
  try {
    if (navigator.share) await navigator.share(data)
    else await navigator.clipboard.writeText(data.url)
  } catch { /* dismissed */ }
}

onMounted(() => mq.addEventListener('change', onMq))
onBeforeUnmount(() => { mq.removeEventListener('change', onMq); io?.disconnect() })
</script>

<template>
  <dialog
    ref="dlg"
    class="pc"
    :class="{ mobile }"
    :style="teamStyle"
    :aria-labelledby="`${id}-name`"
    @close="onClose"
    @click="onClick"
  >
    <template v-if="p">
      <!-- ===== Desktop ===== -->
      <div v-if="!mobile" class="grid">
        <aside class="teamcol" :aria-label="`${name} profile`">
          <span class="wm" aria-hidden="true"></span>
          <div class="ident">
            <JerseyMark class="jm" :abbr="p.abbr" :num="num" :color="jersey.color" :trim="jersey.trim" :text="jersey.text" number-only />
            <div class="who">
              <h2 :id="`${id}-name`" class="name">{{ name }}</h2>
              <div class="tname">{{ t?.name }}</div>
            </div>
          </div>

          <section class="season" :aria-label="`${season} season averages`">
            <div class="eyebrow-t">{{ season }} · {{ s.gp }} GP</div>
            <StatTrio class="trio" hero :pts="s.avg.pts.toFixed(1)" :reb="s.avg.reb.toFixed(1)" :ast="s.avg.ast.toFixed(1)" labels="ppg" />
          </section>

          <VitalsList class="vit" :rows="rows" :loading="bioStatus === 'loading'" :unavailable="bioStatus === 'failed'" />

          <section class="aw" :aria-labelledby="`${id}-aw`">
            <div class="aw-head">
              <h3 :id="`${id}-aw`">Awards · {{ season }}</h3>
              <span>{{ s.totalAwards }} total</span>
            </div>
            <AwardsList :awards="s.awards" surface="team" />
          </section>
        </aside>

        <section class="logcol" :aria-labelledby="`${id}-log`">
          <header class="log-head">
            <h3 :id="`${id}-log`">Game log <span>{{ season }}</span></h3>
            <button type="button" class="x" aria-label="Close player card" autofocus @click="close">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </header>
          <p v-if="status === 'loading'" class="msg">Loading game log…</p>
          <p v-else-if="status === 'missing'" class="msg">No game log for this player yet.</p>
          <template v-else>
            <GameLogChart v-if="chartGames.length" :games="chartGames" :avg="s.avg" :bar-color="barColor" />
            <GameLogTable :games="s.games" :upcoming="log.upcoming" :avg="s.avg" />
          </template>
        </section>
      </div>

      <!-- ===== Mobile sheet ===== -->
      <div v-else ref="scroller" class="sheet">
        <div class="bar">
          <button type="button" class="round" aria-label="Close player card" autofocus @click="close">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <div class="ctitle" :class="{ on: compact }" aria-hidden="true">
            <b>{{ name }}</b>
            <span>{{ p.abbr }}<template v-if="num"> · #{{ num }}</template><template v-if="pos"> · {{ pos }}</template></span>
          </div>
          <button type="button" class="round" aria-label="Share" @click="share">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </button>
        </div>

        <div class="hero-m">
          <span class="wm" aria-hidden="true"></span>
          <div class="ident">
            <JerseyMark class="jm" :abbr="p.abbr" :num="num" :color="jersey.color" :trim="jersey.trim" :text="jersey.text" number-only />
            <div class="who">
              <h2 :id="`${id}-name`" ref="heroName" class="name">{{ name }}</h2>
              <div class="tname">{{ t?.name }}</div>
            </div>
          </div>
          <div class="hero-stats">
            <StatTrio class="trio" hero :pts="s.avg.pts.toFixed(1)" :reb="s.avg.reb.toFixed(1)" :ast="s.avg.ast.toFixed(1)" labels="ppg" />
            <div class="gp">{{ season }}<br>{{ s.gp }} GP</div>
          </div>
        </div>

        <div class="tabs-m" role="tablist" aria-label="Player card sections">
          <button
            v-for="([k, l], i) in TABS"
            :key="k"
            type="button"
            role="tab"
            :id="`${id}-t-${k}`"
            :aria-selected="tab === k"
            :aria-controls="`${id}-p-${k}`"
            :tabindex="tab === k ? 0 : -1"
            @click="tab = k"
            @keydown="onTabKey($event, i)"
          >{{ l }}</button>
        </div>

        <div :id="`${id}-p-${tab}`" class="panel" role="tabpanel" :aria-labelledby="`${id}-t-${tab}`">
          <template v-if="tab === 'log'">
            <p v-if="status === 'loading'" class="msg">Loading game log…</p>
            <p v-else-if="status === 'missing'" class="msg">No game log for this player yet.</p>
            <template v-else>
              <GameLogChart v-if="chartGames.length" :games="chartGames" :avg="s.avg" :bar-color="barColor" :title="`Last ${chartGames.length} games`" :height="68" class="chart-m" />
              <GameLogTable :games="s.games" :upcoming="log.upcoming" :avg="s.avg" compact />
            </template>
          </template>
          <div v-else-if="tab === 'awards'" class="card-m">
            <AwardsList :awards="s.awards" dates />
          </div>
          <div v-else class="card-m bio-m">
            <VitalsList :rows="rows" :loading="bioStatus === 'loading'" :unavailable="bioStatus === 'failed'" />
          </div>
        </div>
      </div>
    </template>
  </dialog>
</template>

<style scoped>
/* ---------- dialog shell ---------- */
.pc {
  width: min(1090px, 100vw - 48px);
  max-width: none;
  max-height: calc(100dvh - 48px);
  padding: 0;
  border: 1px solid var(--ln);
  border-radius: 16px;
  background: var(--bg);
  color: var(--fg);
  box-shadow: 0 30px 80px rgba(0, 0, 0, .35);
  overflow: auto;
  overscroll-behavior: contain;
}
.pc::backdrop { background: rgba(8, 10, 12, .62); }
.pc[open] { animation: pop .18s ease-out; }
@keyframes pop { from { opacity: 0; transform: translateY(8px) scale(.985); } }

.grid { display: grid; grid-template-columns: 290px 1fr; min-height: 100%; }

/* ---------- team column (always team colours) ---------- */
.teamcol, .hero-m, .bar {
  --fg: #fff;
  --mu: rgba(255, 255, 255, .75);
  --ln: rgba(255, 255, 255, .22);
  --rule: rgba(255, 255, 255, .16);
  --ring: var(--tc);
  color: #fff;
  background:
    repeating-linear-gradient(135deg, rgba(255, 255, 255, .03) 0 1px, transparent 1px 14px),
    var(--tgrad);
  background-color: var(--tc); /* solid fallback (also what contrast checkers measure) */
}
.teamcol { position: relative; overflow: hidden; padding: 26px 24px; display: flex; flex-direction: column; gap: 18px; }
.wm {
  position: absolute;
  width: 340px;
  height: 340px;
  right: -120px;
  bottom: -100px;
  transform: rotate(18deg);
  background: var(--wm);
  -webkit-mask: url('../assets/brand/ball-lines-thin.png') center / contain no-repeat;
  mask: url('../assets/brand/ball-lines-thin.png') center / contain no-repeat;
  pointer-events: none;
}
.teamcol > *:not(.wm), .hero-m > *:not(.wm) { position: relative; }
.ident { display: grid; grid-template-columns: 44px 1fr; gap: 12px; align-items: center; }
.jm { --jw: 44px; --jn: 17px; }
.who { min-width: 0; }
.name { margin: 0; font: 800 26px/1.05 var(--sans); letter-spacing: -.03em; text-wrap: balance; overflow-wrap: anywhere; }
.tname { font: 500 11px var(--mono); opacity: .85; margin-top: 6px; letter-spacing: .04em; }
.eyebrow-t { font: 500 10px var(--mono); letter-spacing: .12em; text-transform: uppercase; opacity: .75; margin-bottom: 10px; }
.season .trio, .hero-stats .trio { --trio-size: 32px; justify-content: flex-start; }
.aw-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
.aw-head h3 { margin: 0; font: 600 10px var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--sec); }
.aw-head span { font: 400 10px var(--mono); opacity: .7; }

/* ---------- game log column ---------- */
.logcol { padding: 22px 24px 24px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.log-head { display: flex; justify-content: space-between; align-items: center; }
.log-head h3 { margin: 0; font: 600 18px var(--sans); }
.log-head h3 span { font: 400 11px var(--mono); color: var(--mu); margin-left: 6px; }
.x, .round {
  display: grid;
  place-items: center;
  border-radius: 50%;
  cursor: pointer;
  flex: none;
}
.x { width: 32px; height: 32px; border: 1px solid var(--ln); background: transparent; color: var(--mu); }
.x:hover { color: var(--fg); border-color: var(--mu); }
.x:focus-visible, .round:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
.msg { color: var(--mu); font-size: 13px; margin: 8px 0; }

/* ---------- mobile sheet ---------- */
.pc.mobile {
  width: 100vw;
  height: 100dvh;
  max-height: none;
  border: 0;
  border-radius: 0;
  overflow: hidden;
}
.pc.mobile[open] { animation: up .24s cubic-bezier(.2, .8, .2, 1); }
@keyframes up { from { transform: translateY(100%); } }
@media (prefers-reduced-motion: reduce) {
  .pc[open], .pc.mobile[open] { animation: none; }
}
.sheet { height: 100%; overflow-y: auto; overscroll-behavior: contain; }
.bar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 8px;
  padding: calc(env(safe-area-inset-top) + 8px) 12px 8px;
}
.round { width: 44px; height: 44px; border: 0; background: rgba(255, 255, 255, .12); color: #fff; }
.ctitle { text-align: center; min-width: 0; opacity: 0; transition: opacity .2s; }
.ctitle.on { opacity: 1; }
.ctitle b { display: block; font: 700 15px var(--sans); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ctitle span { font: 400 10px var(--mono); opacity: .75; }
.hero-m { position: relative; overflow: hidden; padding: 4px 20px 20px; display: grid; gap: 16px; }
.hero-m .ident { grid-template-columns: 52px 1fr; }
.hero-m .jm { --jw: 52px; --jn: 20px; }
.hero-m .name { font-size: 30px; }
.hero-stats { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255, 255, 255, .16); padding-top: 14px; }
.hero-stats .trio { --trio-size: 34px; }
.gp { font: 500 10px/1.6 var(--mono); letter-spacing: .1em; text-align: right; opacity: .8; text-transform: uppercase; }

.tabs-m {
  position: sticky;
  top: calc(env(safe-area-inset-top) + 60px);
  z-index: 4;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  margin: 0;
  padding: 4px;
  background: var(--sf);
  border-bottom: 1px solid var(--ln);
}
.tabs-m button {
  all: unset;
  text-align: center;
  height: 36px;
  margin: 4px 0;
  border-radius: 999px;
  font: 600 13px var(--sans);
  color: var(--mu);
  cursor: pointer;

  &[aria-selected="true"] { background: var(--fg); color: var(--bg); }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
}
/* minmax(0, …): the wide table scrolls inside its card instead of widening the panel */
.panel { padding: 16px 16px calc(env(safe-area-inset-bottom) + 24px); display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
.chart-m { --gap: 5px; }
.card-m { background: var(--sf); border: 1px solid var(--ln); border-radius: 12px; padding: 4px 16px; }
.bio-m :deep(.row) { min-height: 56px; align-items: center; }
.bio-m :deep(.row:first-child) { border-top: 0; }
</style>

<style>
/* Page behind the open player card doesn't scroll. */
html.modal-open { overflow: hidden; }
</style>
