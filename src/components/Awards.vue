<script setup>
import AwardCard from './AwardCard.vue'

defineProps({
  awards: { type: Object, required: true }, // { performer, dud }
  scope: { type: String, required: true }, // 'night' | 'game'
})
</script>

<template>
  <section
    v-if="awards.performer || awards.dud"
    class="cards"
    :aria-label="scope === 'night' ? 'Best and worst of the night' : 'Best and worst of the game'"
  >
    <AwardCard v-if="awards.performer" kind="performer" :award="awards.performer" :link="scope === 'night'"
      :label="scope === 'night' ? 'High performer of the night' : 'High performer'" />
    <AwardCard v-if="awards.dud" kind="dud" :award="awards.dud" :link="scope === 'night'"
      :label="scope === 'night' ? 'Dud of the night' : 'Dud'" />
  </section>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 1040px) {
  .cards { grid-template-columns: 1fr; gap: 10px; }
}
</style>
