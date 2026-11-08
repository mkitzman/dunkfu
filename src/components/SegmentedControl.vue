<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  options: { type: Array, required: true }, // [{ value, label }]
  modelValue: { type: String, required: true },
  label: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

// A thumb slides under the selected option; position comes from the button.
const buttons = ref([])
const thumb = ref({ left: 0, width: 0, ready: false })

function place() {
  const i = props.options.findIndex(o => o.value === props.modelValue)
  const b = buttons.value[i]
  if (b) thumb.value = { left: b.offsetLeft, width: b.offsetWidth, ready: thumb.value.ready || thumb.value.width > 0 }
}

// Radio group keyboard pattern: arrow keys move the selection.
function onKey(e) {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
  if (!step) return
  e.preventDefault()
  const n = props.options.length
  const i = (props.options.findIndex(o => o.value === props.modelValue) + step + n) % n
  emit('update:modelValue', props.options[i].value)
  nextTick(() => buttons.value[i]?.focus())
}

let ro
onMounted(() => {
  place()
  document.fonts?.ready.then(place)
  ro = new ResizeObserver(place)
  buttons.value.forEach(b => ro.observe(b))
})
onBeforeUnmount(() => ro?.disconnect())
watch(() => props.modelValue, () => nextTick(place))
</script>

<template>
  <div class="seg" role="radiogroup" :aria-label="label" @keydown="onKey">
    <span
      class="thumb"
      :class="{ animate: thumb.ready }"
      :style="{ transform: `translateX(${thumb.left}px)`, width: `${thumb.width}px` }"
      aria-hidden="true"
    ></span>
    <button
      v-for="o in options"
      :key="o.value"
      ref="buttons"
      type="button"
      role="radio"
      :aria-checked="o.value === modelValue"
      :tabindex="o.value === modelValue ? 0 : -1"
      :class="{ on: o.value === modelValue }"
      @click="$emit('update:modelValue', o.value)"
    >{{ o.label }}</button>
  </div>
</template>

<style scoped>
.seg {
  position: relative;
  display: flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--ln);
  border-radius: 999px;
  background: var(--sf);
}
.thumb {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 0;
  border-radius: 999px;
  background: var(--fg);
}
.thumb.animate { transition: transform .25s cubic-bezier(.3, .7, .3, 1), width .25s cubic-bezier(.3, .7, .3, 1); }
@media (prefers-reduced-motion: reduce) {
  .thumb.animate { transition: none; }
}
button {
  position: relative;
  border: 0;
  cursor: pointer;
  border-radius: 999px;
  padding: 7px 14px;
  font: 600 13px var(--sans);
  background: transparent;
  color: var(--mu);
  transition: color .2s ease;
}
button.on { color: var(--bg); }
button:not(.on):hover { color: var(--fg); }
button:focus-visible { outline: 2px solid var(--ac); outline-offset: 1px; }

@media (max-width: 720px) {
  .seg { width: 100%; }
  button { flex: 1; padding: 11px 0; font-size: 12px; }
}
</style>
