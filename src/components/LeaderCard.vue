<script setup>
// Top 3 in one stat. Header matches the award cards (rev 6): badge, title,
// share (the card captured as an image, like the award modules).
import PlayerButton from './PlayerButton.vue'
import AwardBadge from './AwardBadge.vue'
import ShareButton from './ShareButton.vue'
import { isFav, favStyle } from '../composables/useFavorite.js'
import { useShareImage } from '../composables/useShare.js'

const props = defineProps({
  label: { type: String, required: true },
  award: { type: String, required: true }, // pts / reb / ast
  leaders: { type: Array, required: true }, // [{ key, name, short, num, abbr, color, value, sub }]
  capture: Boolean, // the off-screen copy rendered for the share image
})

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const { prep, frame, status, share: onShare, prime, shareFromCard } = useShareImage(
  () => `${props.label}|${props.leaders.map(p => p.key).join(',')}`,
  () => ({
    title: `${props.label} leaders`,
    text: `${props.label} leaders: ${props.leaders.map((p, i) => `${i + 1}. ${p.name} ${p.value}`).join(', ')} · dunkfu`,
    filename: `dunkfu-${slug(props.label)}-leaders.png`,
  }),
  !props.capture,
)
</script>

<template>
  <div class="leader-card share-host" @click="shareFromCard" @pointerenter="prime" @focusin="prime" @touchstart.passive="prime">
    <header class="head">
      <AwardBadge :award="award" size="H" decorative />
      <h2>{{ label }}</h2>
      <ShareButton v-if="!capture" :label="`Share ${label.toLowerCase()} leaders`" :status="status" @click="onShare" />
      <span v-else class="site">dunkfu.com</span>
    </header>
    <ol>
      <li v-for="(p, i) in leaders" :key="p.key" :class="{ first: i === 0, fav: isFav(p.abbr) }" :style="isFav(p.abbr) ? favStyle(p.abbr) : null">
        <span class="rank">{{ i + 1 }}</span>
        <div class="who">
          <div class="name">
            <PlayerButton v-if="p.id" :id="p.id" :abbr="p.abbr" :name="p.name" :num="p.num" :pos="p.pos"><span class="full">{{ p.name }}</span><span class="abbrv">{{ p.short }}</span></PlayerButton><template v-else><span class="full">{{ p.name }}</span><span class="abbrv">{{ p.short }}</span></template><span class="team-chip">{{ p.abbr }}</span><span class="num">#{{ p.num }}</span><span v-if="isFav(p.abbr)" class="fav-star" aria-label="Your team">★</span>
          </div>
          <div class="sub">{{ p.sub }}</div>
          <div class="track"><div :style="{ width: `${leaders[0].value ? (100 * p.value) / leaders[0].value : 0}%`, background: p.color }"></div></div>
        </div>
        <span class="value">{{ p.value }}</span>
      </li>
    </ol>

    <Teleport v-if="prep" to="body">
      <div ref="frame" class="shot" aria-hidden="true" inert>
        <LeaderCard capture :label="label" :award="award" :leaders="leaders" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.leader-card {
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: var(--radius);
  padding: 12px 18px 10px;
}
.shot {
  position: fixed;
  left: -10000px;
  top: 0;
  width: 420px;
  padding: 20px;
  background: var(--bg);
  pointer-events: none;
}
.head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; min-width: 0; }
h2 {
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
ol { list-style: none; margin: 0; padding: 0; }
li {
  display: grid;
  grid-template-columns: 16px 1fr 56px;
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-top: 1px solid var(--ln2);
}
/* Favourite team's player: tinted entry bleeding slightly past the card padding. */
li.fav {
  margin: 0 -10px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 8px;
  border-top-color: transparent;
  background: color-mix(in oklch, var(--tc) var(--fav-mix), var(--sf));
}
li.fav + li { border-top-color: transparent; }
.rank { font: 500 13px var(--mono); color: var(--mu); width: 16px; }
.who { min-width: 0; }
.name {
  font: 400 14px var(--sans);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.first .name { font-weight: 600; }
.num { font: 400 11px var(--mono); color: var(--mu); }
.abbrv { display: none; }
.sub { font: 400 11px var(--mono); color: var(--mu); margin-top: 2px; }
.track {
  height: 3px;
  background: var(--ln2);
  border-radius: 2px;
  margin-top: 7px;
  overflow: hidden;

  & div { height: 100%; }
}
.value {
  text-align: center;
  font: 800 20px/1 var(--sans);
  letter-spacing: -.03em;
  font-variant-numeric: tabular-nums;
}
.first .value { font-size: 30px; }

@media (max-width: 720px) {
  .leader-card { padding: 12px 14px 6px; }
  .head { margin-bottom: 8px; }
  li { gap: 10px; padding: 7px 0; }
  /* Favourite team's player: tinted entry bleeding slightly past the card padding. */
li.fav {
  margin: 0 -10px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 8px;
  border-top-color: transparent;
  background: color-mix(in oklch, var(--tc) var(--fav-mix), var(--sf));
}
li.fav + li { border-top-color: transparent; }
.rank { font-size: 12px; width: 14px; }
  .name { font-size: 13px; }
    .num { display: none; }
  .full { display: none; }
  .abbrv { display: inline; }
  .sub { font-size: 10px; }
  .value { font-size: 18px; }
  .first .value { font-size: 26px; }
}
</style>
