<script setup>
// One nightly award card (rev 6): badge + award name + share, the player,
// then one big number with its label. Shared by Breakout, Bricklayer, Ball
// Hawk and Rim Protector (see AwardCards.vue).
import { computed } from 'vue'
import AwardBadge from './AwardBadge.vue'
import PlayerButton from './PlayerButton.vue'
import ShareButton from './ShareButton.vue'
import HelpPopover from './HelpPopover.vue'
import { team, chipStyle } from '../data/teams.js'
import { AWARD } from '../data/awards.js'
import { useShareImage } from '../composables/useShare.js'

const props = defineProps({
  award: { type: String, required: true }, // key in src/data/awards.js
  player: { type: Object, required: true },
  value: { type: [Number, String], required: true },
  unit: { type: String, required: true }, // PTS, TRUE SHOOTING, STL, BLK
  detail: { type: String, default: '' }, // after the unit, same line
  unitTitle: { type: String, default: '' }, // explains the unit, in a ? popup
  capture: Boolean,
})

const title = computed(() => AWARD[props.award].label)
const color = computed(() => team(props.player.abbr)?.color ?? '#646a72')

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const { prep, frame, status, share: onShare, prime } = useShareImage(
  () => `${props.award}|${props.player.id}|${props.player.gameId}`,
  () => ({
    title: `${title.value}: ${props.player.name}`,
    text: `${title.value}: ${props.player.name}, ${props.value} ${props.unit}${props.detail ? ` · ${props.detail}` : ''} · dunkfu`,
    filename: `dunkfu-${slug(title.value)}-${slug(props.player.name)}.png`,
  }),
  !props.capture,
)
</script>

<template>
  <section class="card-c share-host" :aria-label="title" @pointerenter="prime" @focusin="prime" @touchstart.passive="prime">
    <div class="acard">
      <header class="head">
        <AwardBadge :award="award" size="H" decorative />
        <h2 class="title">{{ title }}</h2>
        <ShareButton v-if="!capture" :label="`Share ${title}`" :status="status" @click="onShare" />
        <span v-else class="site">dunkfu.com</span>
      </header>
      <div>
        <div class="name">
          <span v-if="capture">{{ player.name }}</span>
          <PlayerButton v-else :id="player.id" :abbr="player.abbr" :name="player.name" :num="player.num" :pos="player.pos" />
        </div>
        <div class="meta"><span class="team-chip" :style="chipStyle(color)">{{ player.abbr }}</span>#{{ player.num }} · {{ player.min }} MIN</div>
      </div>
      <div class="stat">
        <div class="v">{{ value }}</div>
        <div class="l"><span class="u">{{ unit }}</span><HelpPopover v-if="unitTitle && !capture" :label="`What is ${unit.toLowerCase()}?`" class="uq">{{ unitTitle }}</HelpPopover><template v-if="detail"><span class="u-sep"> · </span>{{ detail }}</template></div>
      </div>
    </div>

    <Teleport v-if="prep" to="body">
      <div ref="frame" class="shot" aria-hidden="true" inert>
        <AwardCard capture :award="award" :player="player" :value="value" :unit="unit" :detail="detail" :unit-title="unitTitle" />
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.shot {
  position: fixed;
  left: -10000px;
  top: 0;
  width: 380px;
  padding: 20px;
  background: var(--bg);
  pointer-events: none;
}
.card-c { container: acard / inline-size; min-width: 0; }
.acard {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  box-sizing: border-box;
  padding: 12px 18px 16px; /* same inset as the leader cards above */
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: 12px;
}
.head { display: flex; align-items: center; gap: 10px; min-width: 0; padding-bottom: 12px; border-bottom: 1px solid var(--ln2); }
.title {
  flex: 1;
  min-width: 0;
  margin: 0;
  font: 600 10px/1 var(--mono);
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.site { flex: none; font: 500 10px/1 var(--mono); letter-spacing: .06em; color: var(--mu); }
.name {
  font: 800 17px/1.15 var(--sans);
  letter-spacing: -.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  & a:hover { text-decoration: underline; text-underline-offset: 3px; }
}
.meta {
  margin-top: 4px;
  font: 500 11px var(--mono);
  color: var(--mu);

  & .team-chip { margin-left: 0; margin-right: 6px; font-size: 11px; }
}
.stat { margin-top: auto; }
.v {
  font: 800 40px/1 var(--sans);
  letter-spacing: -.04em;
  font-variant-numeric: tabular-nums;
  color: var(--fg);
}
.l {
  /* Room above and below so the 16px ? circle isn't clipped by overflow. */
  margin-top: 3px;
  padding: 3px 0;
  font: 500 9px var(--mono);
  letter-spacing: .12em;
  color: var(--mu);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.uq { margin: -4px 2px -4px 6px; vertical-align: middle; }
.uq :deep(.q) { width: 16px; height: 16px; box-sizing: border-box; padding-top: 1px; font-size: 9.5px; letter-spacing: 0; }
.uq :deep(.panel) { font: 400 12px/1.45 var(--sans); letter-spacing: 0; color: var(--fg); white-space: normal; max-width: 260px; }
/* Narrow card: drop the unit word before the shooting line would wrap. */
@container acard (max-width: 230px) {
  .l:has(.u-sep) .u, .l .u-sep { display: none; }
}
</style>
