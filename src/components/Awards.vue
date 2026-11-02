<script setup>
import AwardCard from './AwardCard.vue'

defineProps({
  awards: { type: Object, required: true }, // { performer, dud }
  scope: { type: String, required: true }, // 'night' | 'game'
  heading: { type: Boolean, default: true },
})
</script>

<template>
  <section
    v-if="awards.performer || awards.dud"
    class="awards-section"
    :aria-label="scope === 'night' ? 'Best and worst of the night' : 'Best and worst of the game'"
  >
    <div v-if="heading" class="section-head">
      <h2>{{ scope === 'night' ? 'Best and worst of the night' : 'Best and worst of the game' }}</h2>
      <span class="meta" title="Game Score rolls a full stat line into one number: about 10 is average, 20+ is very good. Expected is the player's season Game Score per minute times tonight's minutes.">
        By Game Score · {{ scope === 'night' ? 'across the league' : 'this game' }}
      </span>
    </div>
    <div class="cards">
      <AwardCard v-if="awards.performer" kind="performer" :award="awards.performer" :link="scope === 'night'"
        :label="scope === 'night' ? 'High performer of the night' : 'High performer'" />
      <AwardCard v-if="awards.dud" kind="dud" :award="awards.dud" :link="scope === 'night'"
        :label="scope === 'night' ? 'Dud of the night' : 'Dud'" />
    </div>
  </section>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.meta { cursor: help; }

@media (max-width: 720px) {
  .section-head { display: block; }
  .section-head h2 { font-size: 15px; }
  .section-head .meta { display: block; margin-top: 2px; font-size: 10px; }
  .cards { grid-template-columns: 1fr; gap: 10px; }
}
</style>
