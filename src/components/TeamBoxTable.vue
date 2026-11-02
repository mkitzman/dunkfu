<script setup>
import { computed } from 'vue'
import TeamMark from './TeamMark.vue'
import { shortName, signed, pct } from '../utils.js'

const props = defineProps({
  team: { type: Object, required: true }, // { abbr, name, color }
  players: { type: Array, required: true },
  pad: { type: Number, default: 0 }, // empty bench rows so paired tables line up
})

const COLS = ['MIN', 'PTS', 'FG', '3PT', 'FT', 'REB', 'AST', 'STL', 'BLK', 'TO', '+/-']

const cells = p => [p.min, p.pts, `${p.fgm}-${p.fga}`, `${p.tpm}-${p.tpa}`, `${p.ftm}-${p.fta}`, p.reb, p.ast, p.stl, p.blk, p.to, signed(p.pm)]

const sections = computed(() => [
  { label: 'STARTERS', rows: props.players.filter(p => p.starter) },
  { label: 'BENCH', rows: props.players.filter(p => !p.starter) },
])

const sum = k => props.players.reduce((s, p) => s + p[k], 0)
const totals = computed(() => ['', sum('pts'), `${sum('fgm')}-${sum('fga')}`, `${sum('tpm')}-${sum('tpa')}`, `${sum('ftm')}-${sum('fta')}`, sum('reb'), sum('ast'), sum('stl'), sum('blk'), sum('to'), ''])
const pcts = computed(() => ['', '', pct(sum('fgm'), sum('fga')), pct(sum('tpm'), sum('tpa')), pct(sum('ftm'), sum('fta')), '', '', '', '', '', ''])
</script>

<template>
  <div class="tbox" :style="{ '--team': team.color }">
    <div class="head">
      <TeamMark :abbr="team.abbr" :size="28" :radius="6" :font-size="10" />
      <h3>{{ team.name }}</h3>
    </div>
    <div class="table-wrap">
      <table class="stats edge">
        <template v-for="(s, si) in sections" :key="s.label">
          <thead v-if="si === 0">
            <tr><th scope="col">{{ s.label }}</th><th v-for="c in COLS" :key="c" scope="col">{{ c }}</th></tr>
          </thead>
          <tbody>
            <tr v-if="si > 0" class="sec">
              <th scope="colgroup">{{ s.label }}</th><th v-for="c in COLS" :key="c" aria-hidden="true">{{ c }}</th>
            </tr>
            <tr v-for="p in s.rows" :key="p.name">
              <td class="name" :title="p.name">{{ shortName(p.name) }} <span class="num">#{{ p.num }}</span></td>
              <td v-for="(v, i) in cells(p)" :key="i" :class="{ em: i === 1 }">{{ v }}</td>
            </tr>
            <template v-if="si === sections.length - 1">
              <tr v-for="n in pad" :key="`pad${n}`" class="pad" aria-hidden="true">
                <td>&nbsp;</td><td colspan="11">DNP</td>
              </tr>
              <tr class="total">
                <td>TEAM</td><td v-for="(v, i) in totals" :key="i">{{ v }}</td>
              </tr>
              <tr class="pct">
                <td></td><td v-for="(v, i) in pcts" :key="i">{{ v }}</td>
              </tr>
            </template>
          </tbody>
        </template>
      </table>
    </div>
  </div>
</template>

<style scoped>
.tbox {
  background: var(--sf);
  border: 1px solid var(--ln);
  border-top: 4px solid var(--team);
  min-width: 0;
}
.head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--ln);

  & h3 { font: 600 14px var(--sans); margin: 0; }
}

table.stats {
  & th { letter-spacing: .04em; padding: 8px 4px; }
  & td { padding: 7px 4px; font-size: 11.5px; }
  & th:first-child, & td:first-child {
    padding-left: 12px;
    padding-right: 8px;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  & td.name { font: 600 12px var(--sans); color: var(--fg); }
  & .num { font: 400 11px var(--mono); color: var(--mu); }
  & tr.total td {
    color: var(--fg);
    font-weight: 500;
    border-top: 1px solid var(--ln);
    background: var(--ln2);
  }
  & tr.total td:first-child {
    font: 600 11px var(--mono);
    letter-spacing: .08em;
    background: linear-gradient(var(--ln2), var(--ln2)), var(--sf);
  }
  & tr.pct td { color: var(--fg); font-weight: 500; border-bottom: 0; }
  & tr.pad td { color: var(--ln); }
  & tr.pad:hover { background: none; }
  & tr.total:hover, & tr.pct:hover, & tr.sec:hover { background: none; }
  & tr.total:hover td { background: var(--ln2); }
}

@media (max-width: 720px) {
  .tbox { border-left: 0; border-right: 0; border-top-width: 3px; }
  .head { padding: 8px var(--gutter); gap: 8px; --mark-size: 24px; --mark-r: 5px; --mark-fs: 9px; }
  .head h3 { font-size: 13px; }
  table.stats {
    & th:first-child, & td:first-child { max-width: 140px; padding-left: var(--gutter); }
    & .num { font-size: 10px; }
    & tr.total td:first-child { font-size: 10px; background: var(--bg); }
  }
}

/* Filler rows only matter while the two tables sit side by side. */
@container (max-width: 1040px) {
  tr.pad { display: none; }
}
</style>
