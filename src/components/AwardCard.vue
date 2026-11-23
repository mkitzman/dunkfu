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
  tied: { type: Array, default: () => [] }, // co-winners (Ball Hawk / Rim Protector ties), best first
  value: { type: [Number, String], required: true },
  unit: { type: String, required: true }, // PTS, TRUE SHOOTING, STL, BLK
  detail: { type: String, default: '' }, // after the unit, same line
  unitTitle: { type: String, default: '' }, // explains the unit, in a ? popup
  capture: Boolean,
})

const title = computed(() => AWARD[props.award].label)
// Ties: 2 players in full; 3 as one line each; 4+ as the first two and "+N more".
const all = computed(() => [props.player, ...props.tied])
const shown = computed(() => all.value.length > 3 ? all.value.slice(0, 2) : all.value)
const extra = computed(() => all.value.slice(shown.value.length))
const names = computed(() => all.value.map(p => p.name).join(' & '))
const colorOf = p => team(p.abbr)?.color ?? '#646a72'

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const { prep, frame, status, share: onShare, prime, shareFromCard } = useShareImage(
  () => `${props.award}|${props.player.id}|${props.player.gameId}`,
  () => ({
    title: `${title.value}: ${names.value}`,
    text: `${title.value}: ${names.value}, ${props.value} ${props.unit}${props.detail ? ` · ${props.detail}` : ''} · dunkfu`,
    filename: `dunkfu-${slug(title.value)}-${slug(props.player.name)}.png`,
  }),
  !props.capture,
)
</script>

<template>
  <section class="card-c share-host" :aria-label="title" @click="shareFromCard" @pointerenter="prime" @focusin="prime" @touchstart.passive="prime">
    <div class="acard">
      <header class="head">
        <AwardBadge :award="award" size="H" decorative />
        <h2 class="title">{{ title }}</h2>
        <ShareButton v-if="!capture" :label="`Share ${title}`" :status="status" @click="onShare" />
        <span v-else class="site">dunkfu.com</span>
      </header>
      <div v-if="all.length <= 2" class="who" :class="{ pair: all.length === 2 }">
        <div v-for="p in all" :key="p.id">
          <div class="name">
            <span v-if="capture">{{ p.name }}</span>
            <PlayerButton v-else :id="p.id" :abbr="p.abbr" :name="p.name" :num="p.num" :pos="p.pos" />
          </div>
          <div class="meta"><span class="team-chip" :style="chipStyle(colorOf(p))">{{ p.abbr }}</span>#{{ p.num }} · {{ p.min }} MIN</div>
        </div>
      </div>
      <ul v-else class="who many">
        <li v-for="p in shown" :key="p.id">
          <span v-if="capture" class="nm">{{ p.name }}</span>
          <PlayerButton v-else class="nm" :id="p.id" :abbr="p.abbr" :name="p.name" :num="p.num" :pos="p.pos" />
          <span class="team-chip" :style="chipStyle(colorOf(p))">{{ p.abbr }}</span>
        </li>
        <li v-if="extra.length" class="more">
          <span v-if="capture">+{{ extra.length }} more</span>
          <HelpPopover v-else :label="`All ${all.length} tied for ${title}`">
            <template #trigger>+{{ extra.length }} more</template>
            <ul class="tie-list">
              <li v-for="p in all" :key="p.id"><PlayerButton :id="p.id" :abbr="p.abbr" :name="p.name" :num="p.num" :pos="p.pos" /><span class="team-chip" :style="chipStyle(colorOf(p))">{{ p.abbr }}</span></li>
            </ul>
          </HelpPopover>
        </li>
      </ul>
      <div class="stat">
        <div class="v">{{ value }}</div>
        <div class="l"><span class="u">{{ unit }}</span><HelpPopover v-if="unitTitle && !capture" :label="`What is ${unit.toLowerCase()}?`" class="uq">{{ unitTitle }}</HelpPopover><template v-if="detail"><span class="u-sep"> · </span>{{ detail }}</template></div>
      </div>
    </div>

    <Teleport v-if="prep" to="body">
      <div ref="frame" class="shot" aria-hidden="true" inert>
        <AwardCard capture :award="award" :player="player" :tied="tied" :value="value" :unit="unit" :detail="detail" :unit-title="unitTitle" />
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
.site { flex: none; font: 800 13px/1 var(--sans); letter-spacing: -.035em; color: var(--mu); } /* wordmark face */
.name {
  font: 800 17px/1.15 var(--sans);
  letter-spacing: -.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  & a:hover { text-decoration: underline; text-underline-offset: 3px; }
}
.pair { display: grid; gap: 10px; }
.many { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.many li { display: flex; align-items: baseline; min-width: 0; font: 700 14px/1.2 var(--sans); letter-spacing: -.01em; }
.many .nm { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.many a.nm:hover { text-decoration: underline; text-underline-offset: 3px; }
.many .team-chip { flex: none; font-size: 10px; }
.many li.more { font: 500 11px var(--mono); color: var(--mu); }
.more :deep(.trig) { font: 500 11px var(--mono); color: var(--mu); text-decoration: underline dotted; text-underline-offset: 3px; }
.more :deep(.trig:hover) { color: var(--fg); }
.tie-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; font: 600 13px var(--sans); }
.tie-list .team-chip { font-size: 10px; }
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
