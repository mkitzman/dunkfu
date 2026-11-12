<script setup>
// Bio facts as label / value (+ sub) rows.
defineProps({
  rows: { type: Array, required: true }, // [{ label, value, sub }]
  loading: Boolean,
  unavailable: Boolean,
})
</script>

<template>
  <dl class="vitals" :aria-busy="loading ? 'true' : undefined">
    <div v-for="r in rows" :key="r.label" class="row">
      <dt>{{ r.label }}</dt>
      <dd><span class="v">{{ r.value }}</span><span v-if="r.sub" class="sub">{{ r.sub }}</span></dd>
    </div>
    <div v-if="loading" class="row note"><dt>Bio</dt><dd><span class="sub">Loading…</span></dd></div>
    <div v-else-if="unavailable" class="row note"><dt>Bio</dt><dd><span class="sub">Not available right now</span></dd></div>
  </dl>
</template>

<style scoped>
.vitals { margin: 0; display: grid; }
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding: 9px 0;
  border-top: 1px solid var(--rule, var(--ln));
}
dt { font: 500 10px var(--mono); letter-spacing: .12em; text-transform: uppercase; opacity: .7; white-space: nowrap; }
dd { margin: 0; display: grid; justify-items: end; text-align: right; min-width: 0; }
.v { font: 600 13px var(--sans); }
.sub { font: 400 10px var(--mono); opacity: .7; margin-top: 2px; }
</style>
