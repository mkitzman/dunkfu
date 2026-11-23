<script setup>
// Dud / Dud of the Night: the quiet counterpart to SpotlightHero.
import { computed } from 'vue'
import StatTrio from './StatTrio.vue'
import PlayerButton from './PlayerButton.vue'
import BrandLockup from './BrandLockup.vue'
import AwardBadge from './AwardBadge.vue'
import ShareButton from './ShareButton.vue'
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
const { prep, frame, status, share: onShare, prime, shareFromCard } = useShareImage(
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
  <section class="dud-c share-host" :aria-label="label" :title="tip" @click="shareFromCard" @pointerenter="prime" @focusin="prime" @touchstart.passive="prime">
    <div class="dud">
      <header class="head">
        <div class="brand">
          <BrandLockup mini />
          <span class="rule" aria-hidden="true"></span>
          <AwardBadge class="badge" :award="/game/i.test(label) ? 'dudg' : 'dud'" size="S" decorative />
          <h2 class="label">{{ label }}</h2>
        </div>
        <ShareButton v-if="!capture" :label="`Share ${label}`" :status="status" @click="onShare" />
        <span v-else class="site">dunkfu.com</span>
      </header>
      <div class="body">
        <div class="who">
          <div class="name">
            <span v-if="capture" class="nm">{{ player.name }}</span><PlayerButton v-else class="nm" :id="player.id" :abbr="player.abbr" :name="player.name" :num="player.num" :pos="player.pos" /><span
              class="team-chip" :style="chipStyle(color)">{{ player.abbr }}</span><span class="num">#{{ player.num }}</span>
          </div>
          <div class="line">{{ line }}</div>
        </div>
        <StatTrio class="trio" :pts="player.pts" :reb="player.reb" :ast="player.ast" />
      </div>
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
  overflow: hidden;
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: 14px;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 22px;
  border-bottom: 1px solid var(--ln);
}
.brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
/* The mini lockup is drawn for dark team colours; here it sits on the page surface. */
.brand :deep(.word) { color: var(--fg); }
.rule { width: 1px; height: 16px; background: var(--ln); flex: none; }
.badge { flex: none; margin-right: -2px; }
.label {
  margin: 0;
  font: 600 11px/1 var(--mono);
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--dn);
  /* Optical alignment: sit the capitals on the wordmark's baseline, not the
     centre of its ascenders (d, k, f), which reads as too high. */
  transform: translateY(1.5px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.site { flex: none; font: 800 15px/1 var(--sans); letter-spacing: -.035em; color: var(--mu); } /* wordmark face */
.body {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 16px 22px;
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

@container dud (max-width: 760px) {
  .head { padding: 10px 16px; }
  .body { grid-template-columns: 1fr; gap: 12px 14px; padding: 14px 16px; }
  .trio { grid-column: 1 / -1; justify-self: start; }
  .name { font-size: 18px; }
  .line { font-size: 11px; }
}
@container dud (max-width: 420px) {
  .rule, .brand :deep(.lockup) { display: none; }
}
</style>
