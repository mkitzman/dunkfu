<script setup>
// Award types he has won, in order with his count. DNP and Injured always
// show (a 0 there is information); other 0s are hidden. Each rule is shown under its name, so
// it reads on phones and with a keyboard (no hover tooltips).
import { computed } from 'vue'
import AwardBadge from './AwardBadge.vue'
import { shortDate } from './playerCard.js'
const props = defineProps({
  awards: { type: Array, required: true }, // from summarize(): [{ key, label, count, dates }]
  surface: { type: String, default: 'neutral' }, // 'team' on the team column
  dates: Boolean, // show the dates earned (mobile Awards tab)
})
const ALWAYS = new Set(['dnp', 'inj'])
const shown = computed(() => props.awards.filter(a => a.count || ALWAYS.has(a.key)))
</script>

<template>
  <ul class="awards" :class="{ withDates: dates }">
    <li v-for="a in shown" :key="a.key" class="row" :class="{ zero: !a.count }">
      <AwardBadge :award="a.key" size="L" :surface="surface" decorative />
      <span class="what">
        <span class="label">{{ a.label }}</span>
        <span class="rule">{{ a.rule }}</span>
        <span v-if="dates" class="when">{{ a.dates.length ? a.dates.slice().reverse().map(shortDate).join(' · ') : '—' }}</span>
      </span>
      <span class="count"><span class="sr-only">: </span>{{ a.count }}</span>
    </li>
  </ul>
</template>

<style scoped>
.awards { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.row { display: grid; grid-template-columns: 32px 1fr auto; align-items: center; gap: 12px; }
.what { min-width: 0; display: grid; }
.label { font: 600 13px/1.25 var(--sans); }
.rule { font: 400 11.5px/1.35 var(--sans); opacity: .72; margin-top: 1px; }
.when { font: 400 10px var(--mono); color: var(--mu); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.count { font: 800 18px/1 var(--sans); font-variant-numeric: tabular-nums; }
.zero .count { opacity: .5; }

.withDates { gap: 0; }
.withDates .row { min-height: 52px; border-top: 1px solid var(--ln2); padding: 6px 0; }
.withDates .row:first-child { border-top: 0; }
.withDates .label { font-size: 14px; }
.withDates .count { font-size: 20px; }
</style>
