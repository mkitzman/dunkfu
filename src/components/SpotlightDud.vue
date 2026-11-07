<script setup>
// Dud / Dud of the Night: the quiet counterpart to SpotlightHero.
import { computed, ref } from 'vue'
import StatTrio from './StatTrio.vue'
import { team, chipStyle } from '../data/teams.js'
import { share } from '../composables/useShare.js'
import { statLine } from './spotlight.js'

const props = defineProps({
  player: { type: Object, required: true },
  label: { type: String, required: true },
  to: { type: String, default: null },
})

const color = computed(() => team(props.player.abbr)?.color ?? '#646a72')
const line = computed(() => `${props.player.min} MIN · ${statLine(props.player)}`)
const tip = computed(() => {
  const { gs, exp } = props.player
  return `Game Score ${gs}` + (exp != null ? ` · expected ${exp}` : '')
})

const copied = ref(false)
async function onShare() {
  const p = props.player
  const r = await share({
    title: `${props.label}: ${p.name}`,
    text: `${props.label}: ${p.name}, ${p.pts} PTS / ${p.reb} REB / ${p.ast} AST · dunkfu`,
  })
  if (r === 'copied') { copied.value = true; setTimeout(() => (copied.value = false), 1800) }
}
</script>

<template>
  <section class="dud" :aria-label="label" :title="tip">
    <h2 class="badge"><span aria-hidden="true">▼</span>{{ label }}</h2>
    <div class="who">
      <div class="name">
        <component :is="to ? 'RouterLink' : 'span'" :to="to ?? undefined" class="nm">{{ player.name }}</component><span
          class="team-chip" :style="chipStyle(color)">{{ player.abbr }}</span><span class="num">#{{ player.num }}</span>
      </div>
      <div class="line">{{ line }}</div>
    </div>
    <StatTrio :pts="player.pts" :reb="player.reb" :ast="player.ast" />
    <button type="button" class="share" @click="onShare"><span aria-hidden="true">↗</span>{{ copied ? 'Copied' : 'Share' }}</button>
  </section>
</template>

<style scoped>
.dud {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 22px;
  align-items: center;
  padding: 16px 22px 16px 24px;
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: 14px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: var(--dn);
  }
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--dn-bg);
  color: var(--dn);
  font: 600 10px var(--mono);
  letter-spacing: .12em;
  text-transform: uppercase;
  white-space: nowrap;

  & span { font-size: 11px; }
}
.who { min-width: 0; }
.name {
  font: 800 20px/1.1 var(--sans);
  letter-spacing: -.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
a.nm:hover { text-decoration: underline; text-underline-offset: 3px; }
a.nm:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; border-radius: 2px; }
.num { font: 400 11px var(--mono); letter-spacing: 0; color: var(--mu); }
.line { font: 400 12px var(--mono); color: var(--mu); margin-top: 5px; }
.share {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: 999px;
  border: 1px solid var(--ln);
  background: var(--sf);
  color: var(--fg);
  font: 600 11px var(--sans);
  cursor: pointer;

  & span { font-size: 12px; }
  &:hover { border-color: var(--mu); background: var(--ln2); }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
}

@media (max-width: 900px) {
  .dud { grid-template-columns: 1fr; gap: 12px; padding: 14px 16px 14px 20px; justify-items: start; }
  .who { justify-self: stretch; }
  .share { position: absolute; top: 12px; right: 14px; }
}
@media (max-width: 720px) {
  .name { font-size: 18px; }
  .line { font-size: 11px; }
}
</style>
