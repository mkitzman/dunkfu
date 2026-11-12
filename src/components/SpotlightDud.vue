<script setup>
// Dud / Dud of the Night: the quiet counterpart to SpotlightHero.
import { computed } from 'vue'
import StatTrio from './StatTrio.vue'
import PlayerButton from './PlayerButton.vue'
import BrandLockup from './BrandLockup.vue'
import { team, chipStyle } from '../data/teams.js'
import { useShareImage } from '../composables/useShare.js'
import { statLine } from './spotlight.js'

const props = defineProps({
  player: { type: Object, required: true },
  label: { type: String, required: true },
  to: { type: String, default: null },
  capture: Boolean, // the off-screen copy rendered for the share image
})

const color = computed(() => team(props.player.abbr)?.color ?? '#646a72')
const line = computed(() => `${props.player.min} MIN · ${statLine(props.player)}`)
const tip = computed(() => {
  const { gs, exp } = props.player
  return `Game Score ${gs}` + (exp != null ? ` · expected ${exp}` : '')
})

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const { prep, frame, status, share: onShare, prime } = useShareImage(
  () => `${props.label}|${props.player.id}|${props.player.gameId}`,
  () => {
    const p = props.player
    return {
      title: `${props.label}: ${p.name}`,
      text: `${props.label}: ${p.name}, ${p.pts} PTS / ${p.reb} REB / ${p.ast} AST · dunkfu`,
      filename: `dunkfu-${slug(props.label)}-${slug(p.name)}.png`,
    }
  },
  !props.capture,
)
</script>

<template>
  <section class="dud-c" :aria-label="label" :title="tip" @pointerenter="prime" @focusin="prime" @touchstart.passive="prime">
    <div class="dud">
      <h2 class="badge"><span aria-hidden="true">▼</span>{{ label }}</h2>
      <div class="who">
        <div class="name">
          <span v-if="capture" class="nm">{{ player.name }}</span><PlayerButton v-else class="nm" :id="player.id" :abbr="player.abbr" :name="player.name" :num="player.num" :pos="player.pos" /><span
            class="team-chip" :style="chipStyle(color)">{{ player.abbr }}</span><span class="num">#{{ player.num }}</span>
        </div>
        <div class="line">{{ line }}</div>
      </div>
      <StatTrio :pts="player.pts" :reb="player.reb" :ast="player.ast" />
      <button v-if="!capture" type="button" class="share" @click="onShare"><span aria-hidden="true">↗</span>{{ status || 'Share' }}</button>
      <BrandLockup v-if="capture" class="brand" />
    </div>

    <!-- Off-screen copy at a fixed desktop width, captured for Share. -->
    <Teleport v-if="prep" to="body">
      <div ref="frame" class="shot" aria-hidden="true" inert>
        <SpotlightDud capture :player="player" :label="label" />
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.shot {
  position: fixed;
  left: -10000px;
  top: 0;
  width: 1080px;
  padding: 28px;
  background: var(--bg);
  pointer-events: none;
}
.dud-c { container: dud / inline-size; }
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
.brand { transform: scale(.8); transform-origin: right center; }
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

@container dud (max-width: 900px) {
  .dud { grid-template-columns: 1fr; gap: 12px; padding: 14px 16px 14px 20px; justify-items: start; }
  .who { justify-self: stretch; }
  .share { position: absolute; top: 12px; right: 14px; }
}
@container dud (max-width: 720px) {
  .name { font-size: 18px; }
  .line { font-size: 11px; }
}
</style>
