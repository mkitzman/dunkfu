<script setup>
// Tank-top jersey in team colours with abbr + number, used in the spotlight hero.
defineProps({
  abbr: { type: String, required: true },
  num: { type: String, default: '' },
  color: { type: String, required: true }, // fill (team primary)
  trim: { type: String, required: true }, // trim + text (team secondary or white)
})
</script>

<template>
  <span class="jersey" aria-hidden="true">
    <svg viewBox="0 0 80 100" fill="none" stroke-linejoin="round" stroke-linecap="round">
      <path d="M22 4 H30 Q40 20 50 4 H58 Q58 24 72 34 V98 H8 V34 Q22 24 22 4 Z" :fill="color" stroke="rgba(255,255,255,.14)" stroke-width="1.5" />
      <path d="M30 4 Q40 20 50 4" :stroke="trim" stroke-width="3" />
      <path d="M31 9 Q40 24 49 9" stroke="#fff" stroke-width="1.6" opacity=".9" />
      <path d="M22 4 Q22 24 8 34" :stroke="trim" stroke-width="3" />
      <path d="M26.5 7 Q26 24 13 36" stroke="#fff" stroke-width="1.6" opacity=".9" />
      <path d="M58 4 Q58 24 72 34" :stroke="trim" stroke-width="3" />
      <path d="M53.5 7 Q54 24 67 36" stroke="#fff" stroke-width="1.6" opacity=".9" />
      <path d="M12 40 V96 M68 40 V96" :stroke="trim" stroke-width="1.6" opacity=".8" />
    </svg>
    <span class="txt" :style="{ color: trim }">
      <span class="ab">{{ abbr }}</span>
      <span class="num">{{ num }}</span>
    </span>
  </span>
</template>

<style scoped>
.jersey {
  position: relative;
  display: block;
  flex: none;
  width: 68px;
  height: 85px;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, .35));
}
svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.txt {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  gap: 4px;
  text-align: center;
  padding-top: 14px;
}
.ab { font: 700 10px var(--mono); letter-spacing: .16em; margin-right: -.16em; }
.num { font: 800 24px/1 var(--sans); letter-spacing: -.04em; }
</style>
