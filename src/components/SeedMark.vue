<script setup>
defineProps({
  seed: { type: Number, required: true },
  label: { type: [Number, String], default: null },
})
</script>

<template>
  <span class="seed" :class="seed <= 6 ? 'playoff' : seed <= 10 ? 'playin' : ''">{{ label ?? seed }}</span>
</template>

<style scoped>
.seed {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  flex: none;
  font: 600 11px var(--mono);
  border: 1px solid var(--ln);
  color: var(--mu);
}
.playoff { background: var(--ac); border-color: var(--ac); color: var(--bg); }
.playin { border-color: var(--ac); color: var(--ac); }

@media (max-width: 720px) {
  .seed { width: 20px; height: 20px; font-size: 10px; }
}
</style>
