<script setup>
defineProps({
  options: { type: Array, required: true }, // [{ value, label }]
  modelValue: { type: String, required: true },
  label: { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="seg" role="radiogroup" :aria-label="label">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="radio"
      :aria-checked="o.value === modelValue"
      :class="{ on: o.value === modelValue }"
      @click="$emit('update:modelValue', o.value)"
    >{{ o.label }}</button>
  </div>
</template>

<style scoped>
.seg {
  display: flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--ln);
  border-radius: 999px;
  background: var(--sf);
}
button {
  border: 0;
  cursor: pointer;
  border-radius: 999px;
  padding: 8px 18px;
  font: 600 13px var(--sans);
  background: transparent;
  color: var(--mu);
}
button.on { background: var(--fg); color: var(--bg); }
button:focus-visible { outline: 2px solid var(--ac); outline-offset: 1px; }

@media (max-width: 720px) {
  .seg { width: 100%; }
  button { flex: 1; padding: 11px 0; font-size: 12px; }
}
</style>
