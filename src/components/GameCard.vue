<script setup>
import { computed } from 'vue'
import TeamMark from './TeamMark.vue'
import { team, accent } from '../data/teams.js'
import { favorite } from '../composables/useFavorite.js'

const props = defineProps({
  game: { type: Object, required: true },
  leaders: { type: Object, default: () => ({}) }, // abbr -> "Markkanen 26.1 PPG"
})

const final = computed(() => props.game.status === 'final')
const nq = computed(() => props.game.away.quarters?.length ?? 4)

const qLabels = computed(() => {
  const l = ['1', '2', '3', '4']
  for (let i = 4; i < nq.value; i++) l.push(i === 4 ? 'OT' : `${i - 3}OT`)
  return l.concat('T')
})

const status = computed(() => {
  if (final.value) return nq.value > 5 ? `Final/${nq.value - 4}OT` : nq.value > 4 ? 'Final/OT' : 'Final'
  if (props.game.note) return props.game.note // Postponed, In progress…
  return props.game.network ? `On ${props.game.network}` : `${props.game.tip} ET`
})

// Favourite team in this game: tint the card in its colours.
const fav = computed(() => [props.game.away.abbr, props.game.home.abbr].includes(favorite.value) ? favorite.value : null)
const favStyle = computed(() => fav.value && { '--tc': team(fav.value).color, '--ta': accent(fav.value) })

const sides = computed(() => {
  const g = props.game
  const awayWon = final.value && g.away.score > g.home.score
  return [
    { ...g.away, ...team(g.away.abbr), won: awayWon, ctx: `${g.away.record}, ${g.away.split} Away` },
    { ...g.home, ...team(g.home.abbr), won: final.value && !awayWon, ctx: `${g.home.record}, ${g.home.split} Home` },
  ]
})
</script>

<template>
  <RouterLink
    v-if="final"
    :to="`/game/${game.id}`"
    class="game card"
    :class="{ fav }"
    :style="favStyle"
    :aria-label="`${sides[0].name} ${sides[0].score}, ${sides[1].name} ${sides[1].score}. Box score`"
  >
    <div class="top"><span>{{ status }}</span><span v-if="fav" class="yours"><span aria-hidden="true">★</span> Your team</span></div>
    <div class="grid" :style="{ '--nq': nq, '--qw': nq > 4 ? '26px' : null }">
      <span></span>
      <span v-for="l in qLabels" :key="l" class="ql">{{ l }}</span>
      <template v-for="s in sides" :key="s.abbr">
        <div class="team" :class="{ won: s.won }">
          <span class="mk" :class="{ 'is-fav': s.abbr === fav }"><TeamMark :abbr="s.abbr" round :size="30" :font-size="8" /></span>
          <div class="tn">
            <div class="nick"><span class="full">{{ s.nick }}</span><span class="ab">{{ s.abbr }}</span></div>
          </div>
        </div>
        <span v-for="(q, i) in s.quarters" :key="i" class="q">{{ q }}</span>
        <span class="total" :class="{ won: s.won }">{{ s.score }}</span>
      </template>
    </div>
  </RouterLink>

  <div v-else class="game card" :class="{ fav }" :style="favStyle">
    <div class="top">
      <span :class="{ net: game.network }">{{ status }}</span>
      <span class="right"><span v-if="fav" class="yours"><span aria-hidden="true">★</span> Your team</span><span v-if="game.network">{{ game.tip }} ET</span></span>
    </div>
    <div class="sched">
      <div v-for="s in sides" :key="s.abbr" class="srow">
        <span class="mk" :class="{ 'is-fav': s.abbr === fav }"><TeamMark :abbr="s.abbr" round :size="30" :font-size="8" /></span>
        <div class="tn">
          <div class="nick">{{ s.nick }}</div>
          <div class="ctx">{{ s.ctx }}</div>
        </div>
        <div class="leader">{{ leaders[s.abbr] }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Glass card: sits on the navy scores panel, which scopes --sf/--ln/--fg. */
.game {
  border-radius: 10px;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  padding: 14px 16px 12px;
  display: grid;
  gap: 10px;
  align-content: start;
}
a.game { transition: transform .15s ease; }
a.game:hover { border-color: color-mix(in srgb, var(--fg) 34%, transparent); }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  a.game:hover { transform: scale(1.02); }
}
a.game:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }

.top {
  display: flex;
  justify-content: space-between;
  font: 500 11px var(--mono);
  color: var(--mu);
  letter-spacing: .06em;
  text-transform: uppercase;

  & .net { color: var(--ac); }
}

/* Favourite team's game: card tinted in its colours, accent border + label. */
.game.fav {
  background: color-mix(in oklch, var(--tc) 40%, var(--sf));
  border-color: color-mix(in oklch, var(--ta) 80%, transparent);
  box-shadow: 0 0 0 1px color-mix(in oklch, var(--ta) 25%, transparent), 0 8px 24px rgba(0, 0, 0, .25);
}
a.game.fav:hover { border-color: var(--ta); }
.right { display: flex; gap: 12px; }
.yours { color: var(--ta); font-weight: 600; letter-spacing: .12em; }
.mk { position: relative; display: inline-flex; flex: none; border-radius: 50%; }
.mk.is-fav { box-shadow: 0 0 0 2px var(--ta); }
.mk.is-fav::after {
  content: '★';
  position: absolute;
  top: -5px;
  right: -6px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--ta);
  color: var(--tc);
  font: 700 9px/15px var(--sans);
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: 1fr repeat(var(--nq), var(--qw, 30px)) 44px;
  align-items: center;
  row-gap: 8px;
  column-gap: 4px;
}
.ql { font: 500 11px var(--mono); color: var(--mu); text-align: center; }
.q { font: 400 13px var(--mono); color: var(--mu); text-align: center; font-variant-numeric: tabular-nums; }
.total {
  font: 800 20px var(--sans);
  letter-spacing: -.02em;
  text-align: center;
  color: var(--mu);
  font-variant-numeric: tabular-nums;

  &.won { color: var(--fg); }
}

.team { display: flex; align-items: center; gap: 9px; min-width: 0; }
.tn { min-width: 0; }
.tn > div { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nick { font-size: 14px; font-weight: 500; color: var(--mu); }
.team.won .nick { font-weight: 700; color: var(--fg); }
.ctx { font-size: 11px; color: var(--mu); }
.ab { display: none; }

.sched { display: grid; gap: 10px; }
.srow {
  display: flex;
  align-items: center;
  gap: 9px;

  & .tn { flex: 1; }
  & .nick { font-weight: 600; color: var(--fg); }
}
.leader { font-size: 11px; color: var(--mu); text-align: right; }

@media (max-width: 720px) {
  .game { padding: 12px 14px; gap: 8px; --mark-size: 24px; --mark-fs: 0; }
  .top { font-size: 10px; }
  /* Favourite team's game: card tinted in its colours, accent border + label. */
.game.fav {
  background: color-mix(in oklch, var(--tc) 40%, var(--sf));
  border-color: color-mix(in oklch, var(--ta) 80%, transparent);
  box-shadow: 0 0 0 1px color-mix(in oklch, var(--ta) 25%, transparent), 0 8px 24px rgba(0, 0, 0, .25);
}
a.game.fav:hover { border-color: var(--ta); }
.right { display: flex; gap: 12px; }
.yours { color: var(--ta); font-weight: 600; letter-spacing: .12em; }
.mk { position: relative; display: inline-flex; flex: none; border-radius: 50%; }
.mk.is-fav { box-shadow: 0 0 0 2px var(--ta); }
.mk.is-fav::after {
  content: '★';
  position: absolute;
  top: -5px;
  right: -6px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--ta);
  color: var(--tc);
  font: 700 9px/15px var(--sans);
  text-align: center;
}

.grid { grid-template-columns: 1fr repeat(var(--nq), 26px) 38px; row-gap: 6px; column-gap: 2px; }
  .ql { font-size: 10px; }
  .q { font-size: 12px; }
  .total { font-size: 17px; }
  .team { gap: 7px; }
  .team .nick { font-size: 13px; }
  .team .full { display: none; }
  .team .ab { display: inline; }
  .sched { gap: 8px; }
  .srow { gap: 8px; }
  .srow .nick { font-size: 13px; }
  .srow .ctx { display: none; }
  .leader { font-size: 10px; }
}
</style>
