<script setup>
defineProps({
  tag: { type: String, required: true },
  title: { type: String, required: true },
  short: { type: String, required: true },
  summary: { type: String, default: '' },
  canNext: { type: Boolean, default: true },
})
defineEmits(['prev', 'next'])
</script>

<template>
  <div class="datenav">
    <button type="button" class="arrow" aria-label="Previous day" @click="$emit('prev')">◀</button>
    <div class="label">
      <div class="eyebrow">{{ tag }}</div>
      <h1 class="date">
        <span class="long">{{ title }}</span>
        <span class="short">{{ short }}</span>
      </h1>
      <div v-if="summary" class="summary">{{ summary }}</div>
    </div>
    <button type="button" class="arrow" aria-label="Next day" :disabled="!canNext" @click="$emit('next')">▶</button>
  </div>
</template>

<style scoped>
.datenav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 28px var(--gutter) 20px;
}
.arrow {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--ln);
  background: var(--sf);
  color: var(--fg);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  flex: none;

  &:disabled { opacity: .35; cursor: default; }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
}
.label { text-align: center; min-width: 260px; }
.date {
  font: 600 24px/1.2 var(--sans);
  letter-spacing: -.02em;
  margin: 4px 0 0;
}
.short { display: none; }
.summary { font-size: 12px; color: var(--mu); margin-top: 4px; }

@media (max-width: 720px) {
  .datenav { padding: 16px var(--gutter) 4px; gap: 12px; }
  .label { min-width: 0; flex: 1; }
  .arrow { width: 40px; height: 40px; font-size: 11px; }
  .eyebrow { font-size: 9px; letter-spacing: .1em; }
  .date { font-size: 17px; margin-top: 2px; }
  .long { display: none; }
  .short { display: inline; }
  .summary { font-size: 11px; }
}
</style>
