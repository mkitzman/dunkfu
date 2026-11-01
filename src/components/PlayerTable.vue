<script setup>
import { computed } from 'vue'
import { useSort } from '../composables/useSort.js'
import { team } from '../data/teams.js'
import { shortName, signed } from '../utils.js'

const props = defineProps({
  players: { type: Array, required: true },
  averages: Boolean, // schedule days: per-game averages + shooting percentages
})

const cols = computed(() => [
  ['min', 'MIN'], ['pts', 'PTS'], ['reb', 'REB'], ['ast', 'AST'], ['stl', 'STL'], ['blk', 'BLK'], ['tov', 'TOV'],
  ['fg', props.averages ? 'FG%' : 'FG'], ['tp', props.averages ? '3P%' : '3P'], ['ft', props.averages ? 'FT%' : 'FT'], ['pm', '+/-'],
].map(([key, label]) => ({ key, label })))

const rows = computed(() => props.players.map(p => {
  const f1 = n => n.toFixed(1)
  const s = props.averages
    ? { min: p.min, pts: p.pts, reb: p.reb, ast: p.ast, stl: p.stl, blk: p.blk, tov: p.tov, fg: p.fgPct, tp: p.tpPct, ft: p.ftPct, pm: p.pm }
    : { min: p.min, pts: p.pts, reb: p.reb, ast: p.ast, stl: p.stl, blk: p.blk, tov: p.tov, fg: p.fgm, tp: p.tpm, ft: p.ftm, pm: p.pm }
  const d = props.averages
    ? { ...Object.fromEntries(Object.entries(s).map(([k, v]) => [k, f1(v)])), pm: signed(p.pm, 1) }
    : { ...s, fg: `${p.fgm}-${p.fga}`, tp: `${p.tpm}-${p.tpa}`, ft: `${p.ftm}-${p.fta}`, pm: signed(p.pm) }
  return { key: `${p.abbr}-${p.name}`, name: p.name, short: shortName(p.name), abbr: p.abbr, pos: p.pos, color: team(p.abbr)?.color, s, d }
}))

const { sort, setSort, sorted } = useSort(rows, (r, k) => r.s[k])

const ariaSort = key => (sort.value.key === key ? (sort.value.dir < 0 ? 'descending' : 'ascending') : 'none')
</script>

<template>
  <div class="table-wrap card player-table">
    <table class="stats edge">
      <thead>
        <tr>
          <th scope="col">PLAYER</th>
          <th
            v-for="c in cols"
            :key="c.key"
            scope="col"
            class="sortable"
            :class="{ sorted: sort.key === c.key }"
            :aria-sort="ariaSort(c.key)"
          >
            <button type="button" @click="setSort(c.key)">{{ c.label }}{{ sort.key === c.key ? (sort.dir < 0 ? ' ▾' : ' ▴') : '' }}</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in sorted" :key="r.key">
          <th scope="row" class="player">
            <span class="bar" :style="{ background: r.color }"></span>
            <span class="who">
              <span class="name"><span class="full">{{ r.name }}</span><span class="abbrv">{{ r.short }}</span></span>
              <span class="sub">{{ r.abbr }}<template v-if="r.pos"> · {{ r.pos }}</template></span>
            </span>
          </th>
          <td
            v-for="c in cols"
            :key="c.key"
            :class="{ sorted: sort.key === c.key, em: c.key === 'pts' || sort.key === c.key }"
          >{{ r.d[c.key] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Row headers are <th> for accessibility; style them as the sticky first cell. */
table.stats tbody th.player {
  display: table-cell;
  text-align: left;
  font: inherit;
  letter-spacing: 0;
  color: var(--fg);
  background: var(--sf);
  padding: 7px 14px 7px 12px;
  border-bottom: 1px solid var(--ln2);
  position: sticky;
  left: 0;
  z-index: 1;
}
.player { white-space: nowrap; }
.player > * { vertical-align: middle; }
.bar {
  display: inline-block;
  width: 3px;
  height: 26px;
  border-radius: 2px;
  margin-right: 10px;
}
.who { display: inline-flex; flex-direction: column; }
.name { font: 600 13px var(--sans); }
.sub { font: 400 11px var(--sans); color: var(--mu); }
.abbrv { display: none; }

td { padding: 7px 12px; font-size: 13px; }
td.sorted.em { font-weight: 600; }
thead th:not(:first-child) { padding: 0; }
:deep(th.sortable button) { padding: 11px 12px; font: 500 11px var(--mono); letter-spacing: .08em; }
thead th:first-child { padding: 11px 14px; font-size: 11px; letter-spacing: .08em; }

@media (max-width: 720px) {
  .player-table { border-left: 0; border-right: 0; border-radius: 0; }
  table.stats tbody th.player { background: var(--bg); padding: 7px 10px 7px var(--gutter); max-width: 150px; overflow: hidden; text-overflow: ellipsis; }
  .bar { height: 24px; margin-right: 8px; }
  .who { min-width: 0; max-width: 110px; }
  .name { font-size: 12px; overflow: hidden; text-overflow: ellipsis; }
  .full { display: none; }
  .abbrv { display: inline; }
  .sub { font-size: 10px; }
  td { padding: 7px 10px; font-size: 12px; }
  :deep(th.sortable button) { padding: 15px 10px; font-size: 10px; }
  thead th:first-child { padding: 9px 10px 9px var(--gutter); font-size: 10px; }
}
</style>
