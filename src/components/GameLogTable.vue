<script setup>
// Player card game log: upcoming games, then completed games newest → oldest,
// then season averages. FPTS…TO cells are shaded against his own average.
import { computed } from 'vue'
import AwardStack from './AwardStack.vue'
import { heat, shortDate, weekdayShort } from './playerCard.js'
import { team } from '../data/teams.js'
import { signed } from '../utils.js'

const props = defineProps({
  games: { type: Array, required: true }, // all entries (played / dnp / inj), any order
  upcoming: { type: Array, default: () => [] },
  avg: { type: Object, required: true },
  compact: Boolean, // mobile: sticky combined GAME column, small badges
})

const HEAT = ['fpts', 'pts', 'reb', 'ast', 'stl', 'blk', 'to']
const STAT_COLS = [['fpts', 'FPTS'], ['min', 'MIN'], ['pts', 'PTS'], ['reb', 'REB'], ['ast', 'AST'], ['stl', 'STL'], ['blk', 'BLK'], ['to', 'TO']]
const SHOOT = [['fg', 'FG', 'fgm', 'fga', 'fgPct'], ['3pt', '3PT', 'tpm', 'tpa', 'tpPct'], ['ft', 'FT', 'ftm', 'fta', 'ftPct']]

const rows = computed(() => props.games.slice().sort((a, b) => b.date.localeCompare(a.date)))
// Traded / signed mid-season: a heading row starts each stretch with a team.
const multiTeam = computed(() => new Set(props.games.map(g => g.team).filter(Boolean)).size > 1)
const stintStart = (g, i) => multiTeam.value && g.team && (i === 0 || rows.value[i - 1].team !== g.team)
const COLS_TOTAL = computed(() => (props.compact ? 2 : 4) + STAT_COLS.length + SHOOT.length + 1)
const opp = g => `${g.home ? 'vs' : '@'} ${g.opp}`
const cellHeat = (g, k) => {
  if (!HEAT.includes(k) || !(g.min > 0)) return null
  const x = heat(g[k], props.avg[k], k === 'to')
  return x == null ? null : { class: x > 0 ? 'hot' : 'cold', style: { '--a': (Math.abs(x) * 0.5).toFixed(2) } }
}
const fmtStat = (g, k) => (k === 'fpts' ? g.fpts.toFixed(1) : g[k])
</script>

<template>
  <div class="wrapT">
    <!-- Focusable so keyboard users can scroll it sideways. -->
    <div class="scroll" tabindex="0" role="region" aria-label="Game log table">

      <table class="log" :class="{ compact }">
        <caption class="sr-only">Game log</caption>
        <thead>
          <tr>
            <template v-if="compact"><th scope="col" class="game">GAME</th></template>
            <template v-else>
              <th scope="col" class="l">DATE</th>
              <th scope="col" class="l">OPP</th>
              <th scope="col" class="l">RESULT</th>
            </template>
            <th scope="col" class="l awd"><abbr title="Awards">AWD</abbr></th>
            <th v-for="[k, l] in STAT_COLS" :key="k" scope="col"><abbr v-if="k === 'fpts'" title="Fantasy points (Yahoo default scoring)">{{ l }}</abbr><template v-else>{{ l }}</template></th>
            <th v-for="[k, l] in SHOOT" :key="k" scope="col">{{ l }}</th>
            <th scope="col">+/-</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in upcoming" :key="u.gameId" class="up">
            <template v-if="compact">
              <th scope="row" class="game"><span class="d">{{ shortDate(u.date) }}</span> <span class="o">{{ opp(u) }}</span><span class="r tip">{{ weekdayShort(u.date) }} {{ u.tip }}</span></th>
            </template>
            <template v-else>
              <th scope="row" class="l d">{{ shortDate(u.date) }}</th>
              <td class="l">{{ opp(u) }}</td>
              <td class="l tip">{{ weekdayShort(u.date) }} {{ u.tip }}</td>
            </template>
            <td :colspan="1 + STAT_COLS.length + SHOOT.length + 1"><span class="sr-only">Upcoming</span></td>
          </tr>

          <template v-for="(g, i) in rows" :key="g.gameId">
          <tr v-if="stintStart(g, i)" class="stint">
            <th scope="colgroup" :colspan="COLS_TOTAL" class="l">With {{ team(g.team)?.name ?? g.team }}</th>
          </tr>
          <tr>
            <template v-if="compact">
              <th scope="row" class="game">
                <span class="d">{{ shortDate(g.date) }}</span> <span class="o">{{ opp(g) }}</span>
                <span class="r"><b :class="g.result === 'W' ? 'w' : 'lo'">{{ g.result }}</b> {{ g.score }}</span>
              </th>
            </template>
            <template v-else>
              <th scope="row" class="l d">{{ shortDate(g.date) }}</th>
              <td class="l">{{ opp(g) }}</td>
              <td class="l"><b :class="g.result === 'W' ? 'w' : 'lo'">{{ g.result }}</b> {{ g.score }}</td>
            </template>
            <td class="l awd"><AwardStack :awards="g.awards" :size="compact ? 'S' : 'M'" /></td>
            <template v-if="g.min > 0">
              <td v-for="[k] in STAT_COLS" :key="k" v-bind="cellHeat(g, k)" :class="{ em: k === 'fpts' || k === 'pts' }">{{ fmtStat(g, k) }}</td>
              <td v-for="[k, , m, a] in SHOOT" :key="k">{{ g[m] }}-{{ g[a] }}</td>
              <td>{{ signed(g.pm) }}</td>
            </template>
            <td v-else :colspan="STAT_COLS.length + SHOOT.length + 1" class="l absent">{{ g.awards.includes('inj') ? 'Out (not on the box score)' : 'Did not play' }}</td>
          </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" :colspan="compact ? 2 : 4" class="l">SEASON AVG</th>
            <td v-for="[k] in STAT_COLS" :key="k" class="em">{{ avg[k].toFixed(1) }}</td>
            <td v-for="[k, , , , p] in SHOOT" :key="k">{{ avg[p] == null ? '—' : `${avg[p]}%` }}</td>
            <td>{{ (avg.pm > 0 ? '+' : '') + avg.pm.toFixed(1) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <p class="legend">
      <span><i class="sw hot" aria-hidden="true"></i>Above his average</span>
      <span><i class="sw cold" aria-hidden="true"></i>Below (TO reversed)</span>
      <span v-if="compact" class="swipe">Swipe table for more →</span>
    </p>
  </div>
</template>

<style scoped>
.scroll { overflow-x: auto; background: var(--sf); border: 1px solid var(--ln); border-radius: 12px; }
table.log { border-collapse: collapse; width: 100%; white-space: nowrap; font-variant-numeric: tabular-nums; }
th, td { padding: 9px 5px; text-align: right; font: 400 11.5px var(--mono); color: var(--mu); border-bottom: 1px solid var(--ln2); }
thead th { font: 500 10px var(--mono); letter-spacing: .08em; color: var(--mu); background: var(--ln2); border-bottom: 1px solid var(--ln); padding: 10px 5px; }
thead abbr { text-decoration: none; cursor: help; }
.l { text-align: left; }
th[scope="row"].d, .game .d { color: var(--fg); }
td.em { color: var(--fg); font-weight: 600; }
b.w { color: var(--up); font-weight: 600; }
b.lo { color: var(--dn); font-weight: 600; }
.tip { color: var(--ac); }
.up td, .up th { color: var(--mu); }
.awd { padding-top: 6px; padding-bottom: 6px; }
.absent { font-size: 11px; letter-spacing: .04em; }
tr.stint th { font: 600 10px var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--fg); background: var(--ln2); padding-top: 7px; padding-bottom: 7px; }
.compact tr.stint th { position: sticky; left: 0; }
th:first-child, td:first-child { padding-left: 12px; }
th:last-child, td:last-child { padding-right: 12px; }
tfoot th, tfoot td { background: var(--ln2); border-top: 1px solid var(--ln); border-bottom: 0; font-weight: 600; color: var(--fg); }
tfoot th { font: 600 11px var(--mono); letter-spacing: .08em; }

/* Heat against his average (alpha from --a) */
td.hot { background: oklch(.55 .12 150 / var(--a)); color: var(--fg); }
td.cold { background: oklch(.55 .13 25 / var(--a)); color: var(--fg); }
:global([data-theme="light"]) td.hot { background: oklch(.72 .13 150 / var(--a)); }
:global([data-theme="light"]) td.cold { background: oklch(.7 .14 25 / var(--a)); }

.legend { display: flex; flex-wrap: wrap; gap: 16px; margin: 10px 2px 0; font: 400 11px var(--mono); color: var(--mu); }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.sw { width: 10px; height: 10px; border-radius: 2px; }
.sw.hot { background: oklch(.55 .12 150 / .5); }
.sw.cold { background: oklch(.55 .13 25 / .5); }
.swipe { margin-left: auto; }

/* Mobile: sticky combined first column */
.compact .game {
  position: sticky;
  left: 0;
  z-index: 2;
  background: var(--sf);
  border-right: 1px solid var(--ln);
  text-align: left;
  min-width: 118px;
  font: 500 12px/1.35 var(--mono);
}
.compact thead .game { background: color-mix(in srgb, var(--fg) 4%, var(--sf)); }
.compact tfoot th { position: sticky; left: 0; z-index: 2; background: color-mix(in srgb, var(--fg) 4%, var(--sf)); }
.game .o { color: var(--mu); }
.game .r { display: block; font-size: 10px; color: var(--mu); }
.game .r.tip { color: var(--ac); }
</style>
