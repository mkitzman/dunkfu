<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SegmentedControl from '../components/SegmentedControl.vue'
import SeedMark from '../components/SeedMark.vue'
import TeamMark from '../components/TeamMark.vue'
import HelpPopover from '../components/HelpPopover.vue'
import { getStandings } from '../api/index.js'
import { prepare, groupStandings } from '../composables/useStandings.js'
import { favorite, isFav, favStyle } from '../composables/useFavorite.js'
import { todayNY, addDays, dateLong, STAT_NAMES } from '../utils.js'

const route = useRoute()
const router = useRouter()

const VIEWS = [
  { value: 'league', label: 'League' },
  { value: 'conference', label: 'Conference' },
  { value: 'division', label: 'Division' },
]
const view = computed({
  get: () => (VIEWS.some(v => v.value === route.query.view) ? route.query.view : 'conference'),
  set: v => router.replace({ query: v === 'conference' ? {} : { view: v } }),
})

const today = todayNY()
const through = dateLong(addDays(today, -1))
const season = (() => {
  const [y, m] = today.split('-').map(Number)
  const start = m >= 10 ? y : y - 1
  return `${start}–${String(start + 1).slice(2)} season`
})()

const rows = ref([])
onMounted(async () => { rows.value = prepare(await getStandings()) })

const groups = computed(() => (rows.value.length ? groupStandings(rows.value, view.value, favorite.value) : []))

const COLS = ['W', 'L', 'PCT', 'GB', 'HOME', 'AWAY', 'CONF', 'PPG', 'OPP', 'DIFF', 'STRK', 'L10']
// Fixed widths so every table (conference, division) lines up; TEAM takes the rest.
const WIDTHS = { CHG: 72, W: 40, L: 40, PCT: 60, GB: 50, HOME: 60, AWAY: 60, CONF: 60, PPG: 60, OPP: 60, DIFF: 60, STRK: 52, L10: 52 }
const fmtPct = p => p.toFixed(3).replace(/^0/, '')
const move = m => (m > 0 ? `▲${m}` : m < 0 ? `▼${-m}` : '—')
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
              <div class="li"><dt><SeedMark :seed="6" label="" class="sm" /></dt><dd>Playoff</dd><dd class="rg">1–6</dd></div>
              <div class="li"><dt><SeedMark :seed="8" label="" class="sm" /></dt><dd>Play-in</dd><dd class="rg">7–10</dd></div>
              <div v-if="view !== 'division'" class="li"><dt><i class="ex-cut"></i></dt><dd>Lottery</dd><dd class="rg">11–15</dd></div>
              <hr>
              <div class="li"><dt class="arrows"><b class="pos">▲</b><b class="neg">▼</b></dt><dd>Seed change since last night</dd></div>
              <div v-if="view === 'league'" class="li"><dt class="ex-tag">W1</dt><dd>Conference seed</dd></div>
            </dl>
          </HelpPopover>
        </div>
      </div>
      <SegmentedControl v-model="view" :options="VIEWS" label="Standings view" />
    </div>


    <div class="wrap groups">
      <section v-for="g in groups" :key="g.key" class="group" :class="{ 'conf-start': g.confHead }">
        <h2 v-if="g.confHead" class="conf-head">{{ g.confHead }}</h2>
        <div class="ghead">
          <component :is="g.confHead !== undefined ? 'h3' : 'h2'" class="gtitle">{{ g.title }}</component>
          <span v-if="g.sub" class="sub">{{ g.sub }}</span>
        </div>
        <div class="table-wrap card">
          <table class="stats edge">
            <colgroup>
              <col>
              <col :style="{ width: `${WIDTHS.CHG}px` }">
              <col v-for="c in COLS" :key="c" :style="{ width: `${WIDTHS[c]}px` }">
            </colgroup>
            <thead>
              <tr>
                <th scope="col">TEAM</th>
                <th scope="col" class="c" :title="STAT_NAMES.CHG">CHG</th>
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
                  <td class="em">{{ t.w }}</td>
                  <td class="em">{{ t.l }}</td>
                  <td>{{ fmtPct(t.pct) }}</td>
                  <td>{{ t.gb === 0 ? '—' : t.gb.toFixed(1) }}</td>
                  <td>{{ t.home }}</td>
                  <td>{{ t.away }}</td>
                  <td>{{ t.conf }}</td>
                  <td>{{ t.ppg.toFixed(1) }}</td>
                  <td>{{ t.opp.toFixed(1) }}</td>
                  <td :class="tone(t.diff)">{{ (t.diff > 0 ? '+' : '') + t.diff.toFixed(1) }}</td>
                  <td>{{ t.streak }}</td>
                  <td>{{ t.last10 }}</td>
                </tr>
                <tr v-if="g.cutAfter?.(t)" class="cut" aria-hidden="true">
                  <td :colspan="COLS.length + 2"></td>
                </tr>
              </template>
            </tbody>
          </table>
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
  padding-bottom: 18px;
}
h1 {
  font: 600 28px/1.1 var(--sans);
  letter-spacing: -.02em;
  margin: 4px 0 0;
}
.through { font-size: 12px; color: var(--mu); margin-top: 4px; }

.through { display: flex; align-items: center; gap: 8px; }
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
  & hr { grid-column: 1 / -1; width: 100%; margin: 2px 0; border: 0; border-top: 1px solid var(--ln); }
  & b { font: 500 11px var(--sans); }
  & .sm { width: 20px; height: 20px; }
  & .ex-tag { font: 400 11px var(--mono); color: var(--mu); }
  & .ex-cut { display: block; width: 26px; border-top: 1.5px dashed var(--ac); }
}

.groups { display: grid; gap: 26px; padding-bottom: 32px; }
.group { min-width: 0; } /* let the table scroll instead of widening the page */
.ghead {
  display: grid;
  gap: 8px;
  margin-bottom: 10px;

  & .gtitle { font: 600 16px var(--sans); margin: 0; }
}
/* Division view: conference heading above its first division; extra space
   before the second conference. */
.conf-head { font: 800 22px/1.1 var(--sans); letter-spacing: -.02em; margin: 0 0 14px; }
.group.conf-start:not(:first-child) { margin-top: 22px; }
.sub { font: 400 11px var(--mono); color: var(--mu); }

.team { display: flex; align-items: center; gap: 10px; min-width: 0; }
.name { font: 600 13px var(--sans); color: var(--fg); min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nick { display: none; }
.tag { flex: none; font: 400 10px var(--mono); color: var(--mu); }

table.stats {
  table-layout: fixed;
  min-width: 920px; /* team column never narrower than ~190px; scrolls on phones */
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


  .groups { gap: 0; padding-left: 0; padding-right: 0; padding-bottom: 24px; }
  .group { padding-top: 16px; }
  .ghead { padding: 0 var(--gutter); margin-bottom: 8px; }
  .ghead .gtitle { font-size: 15px; }
  .conf-head { font-size: 19px; padding: 0 var(--gutter); margin-bottom: 10px; }
  .group.conf-start:not(:first-child) { margin-top: 18px; }
  .sub { font-size: 10px; }
  table.stats tbody tr.fav > td { background: color-mix(in oklch, var(--tc) var(--fav-mix), var(--bg)); }
  .card { border-left: 0; border-right: 0; border-bottom: 0; border-radius: 0; background: transparent; }

  .team { gap: 8px; --mark-size: 24px; --mark-r: 5px; --mark-fs: 8px; }
  .name { font-size: 12px; }
  .full, .tag { display: none; }
  .nick { display: inline; }
}
</style>
