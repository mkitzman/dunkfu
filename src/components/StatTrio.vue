<script setup>
// PTS / REB / AST in big numbers. `hero` is the white-on-team-colour version
// (PTS in the accent colour); the default sits on --sf.
defineProps({
  pts: { type: Number, required: true },
  reb: { type: Number, required: true },
  ast: { type: Number, required: true },
  hero: Boolean,
  accent: { type: String, default: null }, // PTS colour in the hero
})
</script>

<template>
  <div class="trio" :class="{ onteam: hero }">
    <template v-for="([l, v], i) in [['PTS', pts], ['REB', reb], ['AST', ast]]" :key="l">
      <span v-if="i" class="sep" aria-hidden="true">/</span>
      <span class="stat">
        <span class="v" :style="hero && i === 0 && accent ? { color: accent } : null">{{ v }}</span>
        <span class="l">{{ l }}</span>
      </span>
    </template>
  </div>
</template>

<style scoped>
/* Sizes come from --trio-size so callers can shrink it responsively. */
.trio {
  --n: var(--trio-size, 32px);
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.sep { font: 400 var(--n)/1 var(--sans); color: var(--ln); user-select: none; }
.stat { display: grid; justify-items: center; min-width: calc(var(--n) * .8); }
.v {
  font: 800 var(--n)/1 var(--sans);
  letter-spacing: -.04em;
  font-variant-numeric: tabular-nums;
  color: var(--fg);
}
.l { font: 500 9px var(--mono); letter-spacing: .1em; margin-right: -.1em; color: var(--mu); margin-top: 5px; }

.onteam { --n: var(--trio-size, 60px); gap: 14px; }
.onteam .sep { color: rgba(255, 255, 255, .22); }
.onteam .stat { min-width: 52px; }
.onteam .v { letter-spacing: -.06em; color: #fff; }
.onteam .l { font-size: 11px; letter-spacing: .16em; margin-right: -.16em; color: rgba(255, 255, 255, .8); margin-top: 8px; }
</style>
