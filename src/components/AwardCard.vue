<script setup>
import { computed } from 'vue'
import { team, onColor } from '../data/teams.js'
import { shortName } from '../utils.js'

const props = defineProps({
  label: { type: String, required: true },
  award: { type: Object, required: true }, // entry from awards/DATE.json
  kind: { type: String, required: true }, // 'performer' | 'dud'
  link: Boolean, // link to the player's game (league-wide view)
})

const a = computed(() => props.award)
const color = computed(() => team(a.value.abbr)?.color ?? '#646a72')

const line = computed(() => {
  const p = a.value
  const parts = [`${p.pts} pts`]
  if (p.reb) parts.push(`${p.reb} reb`)
  if (p.ast) parts.push(`${p.ast} ast`)
  return `${parts.join(', ')} · ${p.fgm}/${p.fga} FG`
})

const reason = computed(() => {
  const { gs, exp, basis } = a.value
  if (props.kind === 'dud') return basis === 'expected' ? `${(exp - gs).toFixed(1)} below expected` : 'Lowest among starters'
  if (exp != null && gs > exp) return `+${(gs - exp).toFixed(1)} vs expected`
  return 'Highest Game Score'
})

// Bar shows Game Score on a 0–40 scale.
const fill = computed(() => Math.max(0, Math.min(100, (100 * a.value.gs) / 40)))
</script>

<template>
  <component :is="link ? 'RouterLink' : 'div'" :to="link ? `/game/${award.gameId}` : undefined" class="award" :class="{ linked: link }">
    <h3>{{ label }}</h3>
    <div class="row">
      <div class="who">
        <div class="name">
          {{ shortName(award.name) }}
          <span class="chip" :style="{ background: color, color: onColor(color) }">{{ award.abbr }}</span>
          <span class="num">#{{ award.num }}</span>
        </div>
        <div class="sub">{{ line }}</div>
        <div class="sub reason" :class="kind">{{ reason }}</div>
        <div class="track"><div :style="{ width: `${fill}%`, background: color }"></div></div>
      </div>
      <span class="value" :title="`Game Score ${award.gs}`">{{ Math.round(award.gs) }}<small>Game score</small></span>
    </div>
  </component>
</template>

<style scoped>
.award {
  display: block;
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: 12px;
  padding: 16px 18px 14px;
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
  margin: 0 0 12px;
}
.row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid var(--ln2);
}
.who { min-width: 0; }
.name {
  font: 600 14px var(--sans);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chip {
  display: inline-block;
  font: 600 9px var(--mono);
  padding: 1px 5px;
  border-radius: 4px;
  vertical-align: 1px;
}
.num { font: 400 11px var(--mono); color: var(--mu); }
.sub { font: 400 11px var(--mono); color: var(--mu); margin-top: 2px; }
.reason.performer { color: var(--ac); }
.reason.dud { color: var(--dn); }
.track {
  height: 3px;
  background: var(--ln2);
  border-radius: 2px;
  margin-top: 7px;
  overflow: hidden;

  & div { height: 100%; }
}
.value {
  font: 800 30px/1 var(--sans);
  letter-spacing: -.03em;
  font-variant-numeric: tabular-nums;
  text-align: right;

  & small {
    display: block;
    margin-top: 4px;
    font: 500 9px var(--mono);
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--mu);
  }
}

@media (max-width: 720px) {
  .award { padding: 12px 14px 10px; }
  h3 { font-size: 10px; margin-bottom: 8px; }
  .name { font-size: 13px; }
  .chip { font-size: 8px; }
  .sub { font-size: 10px; }
  .value { font-size: 26px; }
}
</style>
