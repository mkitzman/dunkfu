<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import TeamMark from '../components/TeamMark.vue'
import LeaderCard from '../components/LeaderCard.vue'
import TeamBoxTable from '../components/TeamBoxTable.vue'
import Awards from '../components/Awards.vue'
import { getGame, getAwards } from '../api/index.js'
import { team } from '../data/teams.js'
import ARENAS from '../data/arenas.json'
import { todayNY, addDays, dateLong, dayTag, shortName } from '../utils.js'

const route = useRoute()
const today = todayNY()

const game = ref(null)
const gameAwards = ref(null)
const loading = ref(true)

let req = 0
watch(() => route.params.id, async id => {
  const n = ++req
  loading.value = true
  const g = await getGame(id)
  const a = g ? await getAwards(g.date) : null
  if (n !== req) return
  game.value = g
  gameAwards.value = a?.games?.[id] ?? null
  loading.value = false
}, { immediate: true })

const backTo = computed(() => (game.value && game.value.date !== addDays(today, -1) ? `/${game.value.date}` : '/'))
const backLabel = computed(() => game.value && `${dayTag(game.value.date, today)} · ${dateLong(game.value.date)}`)

const sides = computed(() => {
  const g = game.value
  if (!g) return []
  const awayWon = g.away.score > g.home.score
  return [
    { ...g.away, ...team(g.away.abbr), won: awayWon, ctx: `${g.away.record}, ${g.away.split} Away` },
    { ...g.home, ...team(g.home.abbr), won: !awayWon, ctx: `${g.home.record}, ${g.home.split} Home` },
  ]
})

// Arena comes from config by home team (neutral-site games will show the home team's arena).
const arena = computed(() => game.value && ARENAS[game.value.home.abbr])

const nq = computed(() => game.value?.away.quarters?.length ?? 4)
const qLabels = computed(() => {
  const l = ['1', '2', '3', '4']
  for (let i = 4; i < nq.value; i++) l.push(i === 4 ? 'OT' : `${i - 3}OT`)
  return l.concat('T')
})
// Quarter heat map: shade each quarter by the margin it was won or lost by.
// Within 2 points stays plain; 15+ gets the full shade.
function heat(margin) {
  const title = margin > 0 ? `Won the quarter by ${margin}` : margin < 0 ? `Lost the quarter by ${-margin}` : 'Even quarter'
  if (Math.abs(margin) <= 2) return { class: 'q', title }
  const strength = Math.min(Math.abs(margin), 15) / 15
  return {
    class: ['q', margin > 0 ? 'q-won' : 'q-lost'],
    style: { '--heat': `${Math.round(8 + strength * 24)}%` },
    title,
  }
}

const status = computed(() => (nq.value > 5 ? `FINAL/${nq.value - 4}OT` : nq.value > 4 ? 'FINAL/OT' : 'FINAL'))

const hasBox = computed(() => sides.value.length && sides.value.every(s => s.players))

const CATS = [
  ['Points', 'pts', p => `${p.fgm}/${p.fga} FG, ${p.ftm}/${p.fta} FT`],
  ['Rebounds', 'reb', p => `${p.dreb} DREB, ${p.oreb} OREB`],
  ['Assists', 'ast', p => `${p.to} TO, ${p.min} MIN`],
]

// Top 3 across both teams per category; ties go to more minutes.
const leaders = computed(() => {
  if (!hasBox.value) return []
  const all = sides.value.flatMap(s => s.players.map(p => ({ ...p, abbr: s.abbr, color: s.color })))
  return CATS.map(([label, key, sub]) => ({
    label,
    list: all.slice().sort((a, b) => b[key] - a[key] || b.min - a.min).slice(0, 3).map(p => ({
      key: `${p.abbr}-${p.name}`, short: shortName(p.name), num: p.num, abbr: p.abbr, color: p.color, value: p[key], sub: sub(p),
    })),
  }))
})
</script>

<template>
  <div class="wrap page">
    <p v-if="!loading && !game" class="missing card">Game not found. <RouterLink to="/" class="eyebrow">Back to scores</RouterLink></p>

    <template v-else-if="game">
      <RouterLink :to="backTo" class="eyebrow back">◀ {{ backLabel }}</RouterLink>

      <section class="strip" :aria-label="`${sides[0].name} ${sides[0].score}, ${sides[1].name} ${sides[1].score}, final`">
        <div class="teams">
          <div v-for="s in sides" :key="s.abbr" class="trow" :class="{ won: s.won }">
            <TeamMark :abbr="s.abbr" :size="44" :radius="8" :font-size="13" />
            <div class="tn">
              <h1 class="name"><span class="full">{{ s.name }}</span><span class="nick">{{ s.nick }}</span></h1>
              <div class="ctx">{{ s.ctx }}</div>
            </div>
            <div class="score">{{ s.score }}</div>
          </div>
        </div>

        <div class="quarters" :style="{ '--cols': qLabels.length }" role="table" aria-label="Scoring by quarter">
          <div role="row" class="qr">
            <span role="columnheader" class="st">{{ status }}</span>
            <span v-for="l in qLabels" :key="l" role="columnheader" class="ql">{{ l }}</span>
          </div>
          <div v-for="(s, si) in sides" :key="s.abbr" role="row" class="qr">
            <span role="rowheader" class="ab">{{ s.abbr }}</span>
            <span
              v-for="(q, i) in s.quarters"
              :key="i"
              role="cell"
              v-bind="heat(q - sides[1 - si].quarters[i])"
            >{{ q }}</span>
            <span role="cell" class="tot" :class="{ up: s.won }">{{ s.score }}</span>
          </div>
        </div>

        <div v-if="arena" class="venue">{{ arena.name }}<br>{{ arena.city }}, {{ arena.state }}</div>
      </section>

      <template v-if="hasBox">
        <Awards v-if="gameAwards" :awards="gameAwards" scope="game" :heading="false" class="block" />

        <section class="block" aria-label="Game leaders">
          <div class="leaders">
            <LeaderCard v-for="c in leaders" :key="c.label" :label="c.label" :leaders="c.list" />
          </div>
        </section>

        <section class="block box">
          <div class="section-head">
            <h2>Box score</h2>
            <span class="meta">FG · 3PT · FT as made-attempted</span>
          </div>
          <div class="pair">
            <TeamBoxTable v-for="s in sides" :key="s.abbr" :team="s" :players="s.players" />
          </div>
        </section>
      </template>

      <p v-else class="missing card">The full box score for this game isn't available yet.</p>
    </template>
  </div>
</template>

<style scoped>
.page { padding-bottom: 32px; }
.back { display: inline-block; padding-top: 18px; }
.back:hover { text-decoration: underline; }

.strip {
  margin-top: 14px;
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: 12px;
  padding: 20px 24px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 28px;
  align-items: center;
}
.teams { display: grid; gap: 14px; }
.trow { display: flex; align-items: center; gap: 12px; }
.tn { width: 200px; }
.name {
  font: 600 17px/1.1 var(--sans);
  margin: 0;
  color: var(--mu);
}
.nick { display: none; }
.ctx { font-size: 11px; color: var(--mu); margin-top: 2px; }
.score {
  font: 800 40px/1 var(--sans);
  letter-spacing: -.04em;
  margin-left: auto;
  color: var(--mu);
  font-variant-numeric: tabular-nums;
}
.trow.won .name, .trow.won .score { color: var(--fg); }

.quarters {
  border-left: 1px solid var(--ln);
  padding-left: 28px;
  display: grid;
  row-gap: 4px;
  font: 400 14px var(--mono);
  font-variant-numeric: tabular-nums;
}
.qr {
  display: grid;
  grid-template-columns: 48px repeat(var(--cols), 44px);
  column-gap: 4px;
  align-items: center;

  & > span:not(:first-child) { text-align: center; color: var(--mu); padding: 4px 0; border-radius: 6px; }
  & > span.up { color: var(--fg); }
  & > span.tot { font-weight: 600; }
  & > span.q-won { color: var(--fg); background: color-mix(in oklch, var(--up) var(--heat), transparent); }
  & > span.q-lost { background: color-mix(in oklch, var(--dn) var(--heat), transparent); }
}
.st { font: 500 11px var(--mono); letter-spacing: .1em; color: var(--mu); }
.qr > .ql { font-size: 11px; }
.ab { font: 600 12px var(--sans); }

.venue {
  text-align: right;
  font: 400 11px/1.7 var(--mono);
  color: var(--mu);
}

.block { padding-top: 28px; }
.box { padding-top: 30px; container-type: inline-size; }
.leaders {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.pair {
  display: grid;
  grid-template-columns: 1fr 1fr;

  & > * + * { margin-left: -1px; }
}
@container (max-width: 1040px) {
  .pair { grid-template-columns: 1fr; }
  .pair > * + * { margin-left: 0; margin-top: -1px; }
}

.missing {
  margin: 28px 0 0;
  padding: 28px;
  text-align: center;
  color: var(--mu);
  font-size: 13px;
}

@media (max-width: 860px) {
  .strip { grid-template-columns: 1fr auto; }
  .venue { display: none; }
}

@media (max-width: 720px) {
  .back { font-size: 10px; padding-top: 14px; }
  .strip {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 14px;
    --mark-size: 34px;
    --mark-r: 6px;
    --mark-fs: 11px;
  }
  .teams { gap: 10px; }
  .trow { gap: 10px; }
  .tn { width: auto; flex: 1; }
  .name { font-size: 14px; }
  .full { display: none; }
  .nick { display: inline; }
  .ctx { font-size: 10px; }
  .score { font-size: 30px; }
  .quarters {
    border-left: 0;
    padding-left: 0;
    border-top: 1px solid var(--ln2);
    padding-top: 10px;
    row-gap: 4px;
    font-size: 12px;
  }
  .qr { grid-template-columns: 40px repeat(var(--cols), 1fr); }
  .st { font-size: 0; }
  .qr > .ql { font-size: 10px; }
  .ab { font-size: 11px; }

  .block { padding-top: 20px; }
  .section-head h2 { font-size: 15px; }
  .box .section-head .meta { display: none; }
  .leaders {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 var(--gutter);
    margin: 0 calc(-1 * var(--gutter));
    padding: 0 var(--gutter) 6px;

    & > * { flex: none; width: 300px; scroll-snap-align: start; }
  }
  .box { margin: 0 calc(-1 * var(--gutter)); }
  .box .section-head { padding: 0 var(--gutter); }
  .pair { gap: 18px; }
  .pair > * + * { margin-top: 0; }
}
</style>
