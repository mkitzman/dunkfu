<script setup>
// A player's name that opens his player card.
import { openPlayer } from '../composables/usePlayerCard.js'
const props = defineProps({
  id: { type: [Number, String], required: true },
  abbr: { type: String, required: true },
  name: { type: String, required: true },
  num: { type: [Number, String], default: '' },
  pos: { type: String, default: '' },
})
function open(e) {
  openPlayer({ id: Number(props.id), abbr: props.abbr, name: props.name, num: String(props.num ?? ''), pos: props.pos }, e.currentTarget)
}
</script>

<template>
  <button type="button" class="pname" aria-haspopup="dialog" :title="`${name}: player card`" @click="open"><slot>{{ name }}</slot></button>
</template>

<style scoped>
.pname {
  all: unset;
  cursor: pointer;
  border-radius: 3px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;

  &:hover { text-decoration: underline; text-decoration-thickness: from-font; text-underline-offset: 3px; }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
}
</style>
