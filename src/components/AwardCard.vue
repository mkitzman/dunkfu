<script setup>
// One nightly award card (rev 6): badge + award name + share, the player,
// then one big number with its label. Shared by Breakout, Bricklayer, Ball
// Hawk and Rim Protector (see AwardCards.vue).
import { computed } from 'vue'
import AwardBadge from './AwardBadge.vue'
import PlayerButton from './PlayerButton.vue'
import ShareButton from './ShareButton.vue'
import { team, chipStyle } from '../data/teams.js'
import { AWARD } from '../data/awards.js'
import { useShareImage } from '../composables/useShare.js'

const props = defineProps({
  award: { type: String, required: true }, // key in src/data/awards.js
  player: { type: Object, required: true },
  value: { type: [Number, String], required: true },
  unit: { type: String, required: true }, // PTS, MISSED, STL, BLK
  detail: { type: String, default: '' }, // after the unit, same line
  aside: { type: Object, default: null }, // { value, label, title } beside the number
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
  <section class="card-c" :aria-label="title" @pointerenter="prime" @focusin="prime" @touchstart.passive="prime">
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
        <div class="vrow">
          <span class="v">{{ value }}</span>
          <span v-if="aside" class="aside">{{ aside.value }} <abbr :title="aside.title">{{ aside.label }}</abbr></span>
        </div>
        <div class="l"><span class="u">{{ unit }}</span><template v-if="detail"><span class="u-sep"> · </span>{{ detail }}</template></div>
      </div>
    </div>

    <Teleport v-if="prep" to="body">
      <div ref="frame" class="shot" aria-hidden="true" inert>
        <AwardCard capture :award="award" :player="player" :value="value" :unit="unit" :detail="detail" :aside="aside" />
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
  padding: 12px 14px 16px;
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: 12px;
}
.head { display: flex; align-items: center; gap: 10px; min-width: 0; }
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
.vrow { display: flex; align-items: baseline; gap: 10px; }
.aside {
  font: 700 15px/1 var(--sans);
  letter-spacing: -.01em;
  font-variant-numeric: tabular-nums;
  color: var(--fg);
  white-space: nowrap;

  & abbr { font: 500 10px var(--mono); letter-spacing: .12em; color: var(--mu); text-decoration: none; cursor: help; }
}
.v {
  font: 800 40px/1 var(--sans);
  letter-spacing: -.04em;
  font-variant-numeric: tabular-nums;
  color: var(--fg);
}
.l {
  margin-top: 6px;
  font: 500 9px var(--mono);
  letter-spacing: .12em;
  color: var(--mu);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Narrow card: drop the unit word before the shooting line would wrap. */
@container acard (max-width: 230px) {
  .l:has(.u-sep) .u, .l .u-sep { display: none; }
}
</style>
