<script setup>
import { computed } from 'vue'
import { team, onColor } from '../data/teams.js'

const props = defineProps({
  abbr: { type: String, required: true },
  size: { type: Number, default: 26 },
  radius: { type: Number, default: 6 },
  fontSize: { type: Number, default: 9 },
  round: Boolean,
  blank: Boolean,
})

const style = computed(() => {
  const color = team(props.abbr)?.color ?? '#646a72'
  return {
    '--_s': `${props.size}px`,
    '--_r': props.round ? '50%' : `${props.radius}px`,
    '--_fs': `${props.fontSize}px`,
    background: color,
    color: onColor(color),
  }
})
</script>

<template>
  <span class="mark" :style="style" aria-hidden="true">{{ blank ? '' : abbr }}</span>
</template>

<style scoped>
/* Parents can resize marks responsively via --mark-size / --mark-r / --mark-fs. */
.mark {
  width: var(--mark-size, var(--_s));
  height: var(--mark-size, var(--_s));
  border-radius: var(--mark-r, var(--_r));
  font-size: var(--mark-fs, var(--_fs));
  display: inline-grid;
  place-items: center;
  flex: none;
  font-family: var(--sans);
  font-weight: 800;
  letter-spacing: .02em;
  line-height: 1;
}
</style>
