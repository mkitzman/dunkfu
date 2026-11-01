<script setup>
import { onColor } from '../data/teams.js'

defineProps({
  label: { type: String, required: true },
  leaders: { type: Array, required: true }, // [{ key, short, num, abbr, color, value, sub }]
})
</script>

<template>
  <div class="leader-card">
    <h3>{{ label }}</h3>
    <ol>
      <li v-for="(p, i) in leaders" :key="p.key" :class="{ first: i === 0 }">
        <span class="rank">{{ i + 1 }}</span>
        <div class="who">
          <div class="name">
            {{ p.short }}
            <span class="chip" :style="{ background: p.color, color: onColor(p.color) }">{{ p.abbr }}</span>
            <span class="num">#{{ p.num }}</span>
          </div>
          <div class="sub">{{ p.sub }}</div>
          <div class="track"><div :style="{ width: `${leaders[0].value ? (100 * p.value) / leaders[0].value : 0}%`, background: p.color }"></div></div>
        </div>
        <span class="value">{{ p.value }}</span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.leader-card {
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: 12px;
  padding: 16px 18px 10px;
}
h3 {
  font: 500 11px var(--mono);
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--mu);
  margin: 0 0 12px;
}
ol { list-style: none; margin: 0; padding: 0; }
li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid var(--ln2);
}
.rank { font: 500 13px var(--mono); color: var(--mu); width: 16px; }
.who { min-width: 0; }
.name {
  font: 400 14px var(--sans);
  opacity: .8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.first .name { font-weight: 600; opacity: 1; }
.chip {
  display: inline-block;
  font: 600 9px var(--mono);
  padding: 1px 5px;
  border-radius: 4px;
  vertical-align: 1px;
}
.num { font: 400 11px var(--mono); color: var(--mu); }
.sub { font: 400 11px var(--mono); color: var(--mu); margin-top: 2px; }
.track {
  height: 3px;
  background: var(--ln2);
  border-radius: 2px;
  margin-top: 7px;
  overflow: hidden;

  & div { height: 100%; }
}
.value {
  font: 800 20px/1 var(--sans);
  letter-spacing: -.03em;
  font-variant-numeric: tabular-nums;
}
.first .value { font-size: 30px; }

@media (max-width: 720px) {
  .leader-card { padding: 12px 14px 6px; }
  h3 { font-size: 10px; margin-bottom: 8px; }
  li { gap: 10px; padding: 7px 0; }
  .rank { font-size: 12px; width: 14px; }
  .name { font-size: 13px; }
  .chip { font-size: 8px; }
  .num { display: none; }
  .sub { font-size: 10px; }
  .value { font-size: 18px; }
  .first .value { font-size: 26px; }
}
</style>
