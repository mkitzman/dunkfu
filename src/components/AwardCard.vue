<script setup>
import { computed } from 'vue'
import { team } from '../data/teams.js'

const props = defineProps({
  label: { type: String, required: true },
  award: { type: Object, required: true }, // entry from awards/DATE.json
  kind: { type: String, required: true }, // 'performer' | 'dud'
  link: Boolean, // link to the player's game (league-wide view)
})

const a = computed(() => props.award)
const color = computed(() => team(a.value.abbr)?.color ?? '#646a72')

const note = computed(() => {
  const { gs, exp, basis } = a.value
  if (props.kind === 'dud') return basis === 'expected' ? `${(exp - gs).toFixed(1)} below expected` : 'Lowest among starters'
  if (exp != null && gs > exp) return `+${(gs - exp).toFixed(1)} vs expected`
  return 'Highest Game Score'
})

// Shooting and defense; the big numbers carry PTS/REB/AST.
const line = computed(() => {
  const p = a.value
  return `${p.fgm}/${p.fga} FG · ${p.tpm}/${p.tpa} 3PT · ${p.stl} STL · ${p.blk} BLK`
})

const big = computed(() => [['PTS', a.value.pts], ['REB', a.value.reb], ['AST', a.value.ast]])
</script>

<template>
  <component
    :is="link ? 'RouterLink' : 'div'"
    :to="link ? `/game/${award.gameId}` : undefined"
    class="award"
    :class="{ linked: link }"
    :title="`Game Score ${award.gs}${award.exp != null ? ` · expected ${award.exp}` : ''}`"
  >
    <h3>{{ label }}</h3>
    <div class="row">
      <div class="who">
        <div class="name">
          {{ award.name }}<span class="team-chip" :style="{ '--team': color }">{{ award.abbr }}</span><span class="num">#{{ award.num }}</span>
        </div>
        <div class="note" :class="kind">{{ note }}</div>
        <div class="line">{{ line }}</div>
      </div>
      <div class="big">
        <template v-for="([l, v], i) in big" :key="l">
          <span v-if="i" class="sep" aria-hidden="true">/</span>
          <span class="stat"><span class="v">{{ v }}</span><span class="l">{{ l }}</span></span>
        </template>
      </div>
    </div>
  </component>
</template>

<style scoped>
.award {
  display: block;
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: 12px;
  padding: 18px 18px 14px;
}
a.linked { transition: transform .15s ease; }
a.linked:hover { border-color: color-mix(in srgb, var(--fg) 28%, transparent); }
a.linked:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  a.linked:hover { transform: scale(1.02); }
}
h3 {
  font: 500 11px var(--mono);
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--mu);
  margin: 0 0 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ln2);
}
.row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: center;
}
.who { min-width: 0; }
.name {
  font: 600 15px var(--sans);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.num { font: 400 11px var(--mono); color: var(--mu); }
.note, .line { font: 400 12px var(--mono); margin-top: 4px; }
.note.performer { color: var(--up); }
.note.dud { color: var(--dn); }
.line { color: var(--mu); }

.big { display: flex; gap: 10px; align-items: flex-start; }
.sep { font: 400 40px/1 var(--sans); color: var(--ln); user-select: none; }
.stat { display: grid; justify-items: center; }
.v { font: 800 40px/1 var(--sans); letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.l { font: 500 10px var(--mono); letter-spacing: .1em; color: var(--mu); margin-top: 6px; }

@media (max-width: 720px) {
  .award { padding: 14px 14px 12px; }
  h3 { font-size: 10px; margin-bottom: 10px; padding-bottom: 10px; }
  .row { gap: 10px; }
  .name { font-size: 14px; }
  .note, .line { font-size: 10.5px; }
  .big { gap: 6px; }
  .sep, .v { font-size: 26px; }
  .l { font-size: 9px; margin-top: 4px; }
}
</style>
