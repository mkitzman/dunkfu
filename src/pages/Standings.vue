<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SegmentedControl from '../components/SegmentedControl.vue'
import SeedMark from '../components/SeedMark.vue'
import TeamMark from '../components/TeamMark.vue'
import HelpPopover from '../components/HelpPopover.vue'
import { getStandings } from '../api/index.js'
import { prepare, groupStandings } from '../composables/useStandings.js'
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

const groups = computed(() => (rows.value.length ? groupStandings(rows.value, view.value) : []))

const COLS = ['W', 'L', 'PCT', 'GB', 'HOME', 'AWAY', 'CONF', 'PPG', 'OPP', 'DIFF', 'STRK', 'L10']
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
        <div class="through">Through {{ through }}</div>
      </div>
      <SegmentedControl v-model="view" :options="VIEWS" label="Standings view" />
    </div>


    <div class="wrap groups">
      <section v-for="(g, gi) in groups" :key="g.key" class="group">
        <div class="ghead">
          <h2>
            {{ g.title }}
            <HelpPopover v-if="gi === 0" label="Standings key" class="key">
              <div class="legend">
                <span><SeedMark :seed="6" class="sm" />Playoff · seeds 1–6</span>
                <span><SeedMark :seed="8" class="sm" />Play-in · seeds 7–10</span>
                <span><b class="pos">▲2</b><b class="neg">▼1</b>Seed change, last night</span>
              </div>
            </HelpPopover>
          </h2>
          <span v-if="g.sub" class="sub">{{ g.sub }}</span>
        </div>
        <div class="table-wrap card">
          <table class="stats edge">
            <thead>
              <tr>
                <th scope="col">TEAM</th>
                <th scope="col" class="c" :title="STAT_NAMES.CHG">CHG</th>
                <th v-for="c in COLS" :key="c" scope="col" :title="STAT_NAMES[c]">{{ c }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="t in g.rows" :key="t.abbr">
                <tr>
                  <td>
                    <div class="team">
                      <SeedMark :seed="t.seed" :label="t.rank" />
                      <TeamMark :abbr="t.abbr" :size="26" :radius="6" :font-size="9" />
                      <span class="name"><span class="full">{{ t.name }}</span><span class="nick">{{ t.nick }}</span></span>
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

.key { margin-left: 6px; }
/* Key inside the "?" popover: one item per line. */
.legend {
  display: grid;
  gap: 10px;
  font: 400 11px var(--mono);
  color: var(--mu);

  & > span { display: flex; align-items: center; gap: 7px; }
  & b { font-weight: 500; }
  & .sm { width: 18px; height: 18px; font-size: 9px; }
}

.groups { display: grid; gap: 26px; padding-bottom: 32px; }
.group { min-width: 0; } /* let the table scroll instead of widening the page */
.ghead {
  display: grid;
  gap: 8px;
  margin-bottom: 10px;

  & h2 { font: 600 16px var(--sans); margin: 0; }
}
.sub { font: 400 11px var(--mono); color: var(--mu); }

.team { display: flex; align-items: center; gap: 10px; }
.name { font: 600 13px var(--sans); color: var(--fg); }
.nick { display: none; }
.tag { font: 400 10px var(--mono); color: var(--mu); }

table.stats {
  & .c { text-align: center; }
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
  .ghead h2 { font-size: 15px; }
  .sub { font-size: 10px; }
  .card { border-left: 0; border-right: 0; border-bottom: 0; border-radius: 0; background: transparent; }

  .team { gap: 8px; --mark-size: 24px; --mark-r: 5px; --mark-fs: 8px; }
  .name { font-size: 12px; }
  .full, .tag { display: none; }
  .nick { display: inline; }
}
</style>
