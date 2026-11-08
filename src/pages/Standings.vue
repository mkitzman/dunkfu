<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SegmentedControl from '../components/SegmentedControl.vue'
import SeedMark from '../components/SeedMark.vue'
import TeamMark from '../components/TeamMark.vue'
import HelpPopover from '../components/HelpPopover.vue'
import { getStandings, getGames } from '../api/index.js'
import { prepare, withPrev, groupStandings } from '../composables/useStandings.js'
import { favorite, isFav, favStyle } from '../composables/useFavorite.js'
import { usePageTitle } from '../composables/usePageTitle.js'
import { todayNY, addDays, dateLong, STAT_NAMES } from '../utils.js'
import { team } from '../data/teams.js'
import { CUP, cupGames, cupTables } from '../data/nbaCup.js'

const route = useRoute()
const router = useRouter()

const today = todayNY()
const startYear = (() => { const [y, m] = today.split('-').map(Number); return m >= 10 ? y : y - 1 })()

const VIEWS = [
  { value: 'league', label: 'League' },
  { value: 'conference', label: 'Conference' },
  { value: 'division', label: 'Division' },
  // Only while the Cup config is for this season.
  ...(CUP.season === startYear + 1 ? [{ value: 'cup', label: 'NBA Cup' }] : []),
]
const view = computed({
  get: () => (VIEWS.some(v => v.value === route.query.view) ? route.query.view : 'conference'),
  set: v => router.replace({ query: v === 'conference' ? {} : { view: v } }),
})

usePageTitle(() => `NBA standings: ${VIEWS.find(v => v.value === view.value).label}`)

const yesterday = addDays(today, -1)
const through = dateLong(yesterday)
const season = `${startYear}–${String(startYear + 1).slice(2)} season`

const rows = ref([])
// Last night's games let each view show the change in its own ranking.
onMounted(async () => {
  const [st, games] = await Promise.all([getStandings(), getGames(addDays(today, -1))])
  rows.value = withPrev(prepare(st), games)
})

// NBA Cup: group tables worked out from the Cup Night games (loaded on first
// visit to the view). Tables through last night and through the night
// before give each team's change in group rank.
const cup = ref(null)
watch(view, async v => {
  if (v !== 'cup' || cup.value) return
  const nights = CUP.nights.filter(d => d <= yesterday)
  const games = (await Promise.all(nights.map(d => getGames(d)))).flat()
  cup.value = { now: cupTables(cupGames(games)), prev: cupTables(cupGames(games.filter(g => g.date < yesterday))) }
}, { immediate: true })

const CONF_NAME = { E: 'Eastern Conference', W: 'Western Conference' }
const cupGroups = computed(() => {
  if (!cup.value) return []
  const fav = favorite.value && team(favorite.value)
  const confs = fav?.conference === 'E' ? ['E', 'W'] : ['W', 'E']
  return confs.flatMap(c => {
    const letters = ['A', 'B', 'C'].sort((a, b) =>
      fav?.conference === c ? CUP.groups[c][b].includes(fav.abbr) - CUP.groups[c][a].includes(fav.abbr) : 0)
    return letters.map((g, i) => {
      const before = Object.fromEntries(cup.value.prev[c + g].map(r => [r.abbr, r.rank]))
      return {
        key: `cup-${c}${g}`, title: `Group ${g}`, sub: '',
        confHead: i === 0 ? CONF_NAME[c] : null,
        rows: cup.value.now[c + g].map(r => ({
          ...team(r.abbr), ...r,
          seed: r.rank === 1 ? 1 : 15, // group leader filled, others neutral
          move: before[r.abbr] - r.rank,
        })),
      }
    })
  })
})

// Tables grouped into conference sections for the headings.
const grouped = computed(() => view.value === 'division' || view.value === 'cup')
const sections = computed(() => {
  const out = []
  for (const g of groups.value) {
    if (view.value === 'league' || view.value === 'conference') out.push({ key: g.key, h2: g.title, meta: `${g.rows.length} teams`, tables: [g] })
    else if (g.confHead || !out.length) out.push({ key: g.key, h2: g.confHead, tables: [g] })
    else out.at(-1).tables.push(g)
  }
  if (grouped.value) for (const s of out) s.meta = `${s.tables.length} ${view.value === 'cup' ? 'groups' : 'divisions'}`
  return out
})
const captionLong = g => (view.value === 'division' ? `${g.title} Division` : g.title)

const groups = computed(() => {
  if (view.value === 'cup') return cupGroups.value
  return rows.value.length ? groupStandings(rows.value, view.value, favorite.value) : []
})

const COLS_BY_VIEW = {
  default: ['W', 'L', 'PCT', 'GB', 'HOME', 'AWAY', 'CONF', 'PPG', 'OPP', 'DIFF', 'STRK', 'L10'],
  cup: ['W', 'L', 'PCT', 'GB', 'HOME', 'AWAY', 'PF', 'PA', 'DIFF', 'STRK'],
}
const COLS = computed(() => COLS_BY_VIEW[view.value] ?? COLS_BY_VIEW.default)
// Fixed widths so every table lines up; TEAM takes the rest.
const WIDTHS = { CHG: 72, W: 40, L: 40, PCT: 60, GB: 50, HOME: 60, AWAY: 60, CONF: 60, PPG: 60, OPP: 60, PF: 60, PA: 60, DIFF: 60, STRK: 52, L10: 52 }
// Team column never narrower than ~190px; on phones the table scrolls.
const minWidth = computed(() => 190 + WIDTHS.CHG + COLS.value.reduce((s, c) => s + WIDTHS[c], 0))
const signed = (v, d) => (v > 0 ? '+' : '') + v.toFixed(d)
// Cell text and class per column.
const CELL = {
  W: t => [t.w, 'em'], L: t => [t.l, 'em'],
  PCT: t => [t.pct == null ? '—' : fmtPct(t.pct)], GB: t => [t.gb === 0 ? '—' : t.gb.toFixed(1)],
  HOME: t => [t.home], AWAY: t => [t.away], CONF: t => [t.conf],
  PPG: t => [t.ppg.toFixed(1)], OPP: t => [t.opp.toFixed(1)],
  PF: t => [t.pf], PA: t => [t.pa],
  DIFF: t => [signed(t.diff, Number.isInteger(t.diff) && view.value === 'cup' ? 0 : 1), tone(t.diff)],
  STRK: t => [t.streak], L10: t => [t.last10],
}
const fmtPct = p => p.toFixed(3).replace(/^0/, '')
const move = m => (m > 0 ? `▲${m}` : m < 0 ? `▼${-m}` : '—')
// What the CHG arrows measure in each view (legend + column tooltip).
const CHANGE_LABEL = {
  conference: 'Seed change since last night',
  division: 'Division rank change since last night',
  league: 'League rank change since last night',
  cup: 'Group rank change since last night',
}
// What the dashed line marks; only the conference view draws one.
const LINE_LABEL = {
  conference: 'Playoff / play-in line',
}
const tone = v => (v > 0 ? 'pos' : v < 0 ? 'neg' : '')
</script>

<template>
  <div class="page">
    <div class="wrap top">
      <div class="title">
        <div class="eyebrow">{{ season }}</div>
        <h1>Standings</h1>
        <div class="through">
          Through {{ through }}
          <HelpPopover label="Standings key" class="key">
            <dl class="legend">
              <template v-if="view === 'cup'">
                <div class="li"><dt><SeedMark :seed="1" label="" class="sm" /></dt><dd>Group leader</dd></div>
                <hr>
                <div class="li"><dt class="arrows"><b class="pos">▲</b><b class="neg">▼</b></dt><dd>{{ CHANGE_LABEL[view] }}</dd></div>
                <div class="li"><dd class="note">Group winners and one wild card per conference reach the knockout rounds. Cup games count toward the regular season.</dd></div>
              </template>
              <template v-else>
                <div class="li"><dt><SeedMark :seed="6" label="" class="sm" /></dt><dd>Playoff</dd><dd class="rg">1–6</dd></div>
                <div class="li"><dt><SeedMark :seed="8" label="" class="sm" /></dt><dd>Play-in</dd><dd class="rg">7–10</dd></div>
                <div class="li"><dt><SeedMark :seed="12" label="" class="sm" /></dt><dd>Lottery</dd><dd class="rg">11–15</dd></div>
                <div v-if="LINE_LABEL[view]" class="li"><dt><i class="ex-cut"></i></dt><dd>{{ LINE_LABEL[view] }}</dd></div>
                <hr>
                <div class="li"><dt class="arrows"><b class="pos">▲</b><b class="neg">▼</b></dt><dd>{{ CHANGE_LABEL[view] }}</dd></div>
                <div class="li"><dt class="ex-tag">W1</dt><dd>Conference seed</dd></div>
              </template>
            </dl>
          </HelpPopover>
        </div>
      </div>
      <SegmentedControl v-model="view" :options="VIEWS" label="Standings view" />
    </div>


    <div class="wrap sections">
      <!-- One H2 per section (League, or each conference); divisions and Cup
           groups label their table's first header cell instead of a heading. -->
      <section v-for="sec in sections" :key="sec.key" class="sec">
        <div v-if="sec.h2" class="h2row">
          <h2>{{ sec.h2 }}</h2>
          <span class="hair" aria-hidden="true"></span>
          <span class="count">{{ sec.meta }}</span>
        </div>
        <div class="tables">
        <div v-for="g in sec.tables" :key="g.key" class="table-wrap card">
          <table class="stats edge" :style="{ minWidth: `${minWidth}px` }">
            <colgroup>
              <col>
              <col :style="{ width: `${WIDTHS.CHG}px` }">
              <col v-for="c in COLS" :key="c" :style="{ width: `${WIDTHS[c]}px` }">
            </colgroup>
            <caption class="sr-only">{{ captionLong(g) }}</caption>
            <thead>
              <tr>
                <th scope="col" :class="{ grp: grouped }">{{ grouped ? g.title : 'TEAM' }}</th>
                <th scope="col" class="c" :title="CHANGE_LABEL[view]">CHG</th>
                <th v-for="c in COLS" :key="c" scope="col" :title="STAT_NAMES[c]">{{ c }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="t in g.rows" :key="t.abbr">
                <tr :class="{ fav: isFav(t.abbr) }" :style="isFav(t.abbr) ? favStyle(t.abbr) : null">
                  <td>
                    <div class="team">
                      <SeedMark :seed="t.seed" :label="t.rank" />
                      <TeamMark :abbr="t.abbr" :size="26" :radius="6" :font-size="9" />
                      <span class="name"><span class="full">{{ t.name }}</span><span class="nick">{{ t.nick }}</span><span v-if="isFav(t.abbr)" class="fav-star" aria-label="Your team">★</span></span>
                      <span v-if="g.tag" class="tag">{{ g.tag(t) }}</span>
                    </div>
                  </td>
                  <td class="c mv" :class="tone(t.move)">{{ move(t.move) }}</td>
                  <td v-for="c in COLS" :key="c" :class="CELL[c](t)[1]">{{ CELL[c](t)[0] }}</td>
                </tr>
                <tr v-if="g.cutAfter?.(t)" class="cut" aria-hidden="true">
                  <td :colspan="COLS.length + 2"></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding-top: 26px;
}
.title .eyebrow { letter-spacing: .14em; }
h1 {
  font: 700 32px/1.1 var(--sans);
  letter-spacing: -.025em;
  margin: 6px 0 0;
}
.through { display: flex; align-items: center; gap: 8px; margin-top: 6px; font: 400 13px var(--sans); color: var(--mu); }
/* Key inside the "?" popover: symbol column, label, seed range on the right. */
.legend {
  display: grid;
  grid-template-columns: 34px auto auto;
  column-gap: 12px;
  row-gap: 12px;
  align-items: center;
  margin: 2px 2px;
  min-width: 240px;

  & .li { display: contents; }
  & dt { display: flex; justify-content: center; align-items: center; }
  & dd { margin: 0; font: 500 14px var(--sans); color: var(--fg); white-space: nowrap; }
  & .li > dd:last-child:not(.rg) { grid-column: span 2; } /* no range: label takes both columns */
  & .rg { justify-self: end; font: 400 11px var(--mono); color: var(--mu); }
  & dd.note { grid-column: 1 / -1; margin: 0; max-width: 260px; font: 400 11px/1.5 var(--sans); color: var(--mu); white-space: normal; }
  & hr { grid-column: 1 / -1; width: 100%; margin: 2px 0; border: 0; border-top: 1px solid var(--ln); }
  & b { font: 500 11px var(--sans); }
  & .sm { width: 20px; height: 20px; }
  & .ex-tag { font: 400 11px var(--mono); color: var(--mu); }
  & .ex-cut { display: block; width: 26px; border-top: 1.5px dashed var(--ac); }
}

.sections { display: grid; gap: 32px; padding-top: 28px; padding-bottom: 32px; }
.sec { min-width: 0; } /* let tables scroll instead of widening the page */
/* H2: conference, then a hairline and a count. Lighter than the H1. */
.h2row { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
.h2row h2 { font: 600 18px/1.2 var(--sans); letter-spacing: -.01em; margin: 0; white-space: nowrap; }
.hair { flex: 1; height: 1px; background: var(--ln); }
.count { font: 400 11px var(--mono); color: var(--mu); white-space: nowrap; }
.tables { display: grid; gap: 20px; }
/* Division / Cup group name in place of "TEAM". */
table.stats thead th.grp { font: 600 10px var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--fg); }

.team { display: flex; align-items: center; gap: 10px; min-width: 0; }
.name { font: 600 13px var(--sans); color: var(--fg); min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nick { display: none; }
.tag { flex: none; font: 400 10px var(--mono); color: var(--mu); }

table.stats {
  table-layout: fixed;
  /* Favourite team's row, tinted in its colour (sticky first cell too). */
  & tbody tr.fav > td { background: color-mix(in oklch, var(--tc) var(--fav-mix), var(--sf)); }
  & .c { text-align: center; }
  /* CHG column: room before W so the arrows don't crowd the wins. */
  & th.c, & td.mv { padding-left: 14px; padding-right: 22px; }
  & td.mv { font-weight: 500; }
  & td.pos { color: var(--ac); }
  & td.neg { color: var(--dn); }
  & tr.cut td {
    padding: 0;
    height: 0;
    border-bottom: 1px dashed var(--ac);
  }
  & tr.cut:hover { background: none; }
}

@media (max-width: 720px) {
  .top {
    position: sticky;
    top: 0;
    z-index: 3;
    background: var(--bg);
    border-bottom: 1px solid var(--ln);
    padding-top: 12px;
    padding-bottom: 12px;
    gap: 10px;
  }
  .title { display: flex; align-items: baseline; justify-content: space-between; width: 100%; }
  .title .eyebrow { display: none; }
  h1 { font-size: 20px; margin: 0; }
  .through { font-size: 10px; margin: 0; }


  .sections { gap: 24px; padding: 20px 0 24px; }
  .h2row { padding: 0 var(--gutter); margin-bottom: 10px; gap: 10px; }
  .h2row h2 { font-size: 16px; }
  .tables { gap: 16px; }
  table.stats tbody tr.fav > td { background: color-mix(in oklch, var(--tc) var(--fav-mix), var(--bg)); }
  .card { border-left: 0; border-right: 0; border-bottom: 0; border-radius: 0; background: transparent; }

  .team { gap: 8px; --mark-size: 24px; --mark-r: 5px; --mark-fs: 8px; }
  .name { font-size: 12px; }
  .full, .tag { display: none; }
  .nick { display: inline; }
}
</style>
