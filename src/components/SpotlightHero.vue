<script setup>
// Player of the Game / Player of the Night. `player` is an awards entry
// (server/awards.js); `to` links the name to the player's game.
import { computed, ref } from 'vue'
import BrandLockup from './BrandLockup.vue'
import JerseyMark from './JerseyMark.vue'
import StatTrio from './StatTrio.vue'
import { team, accent, darken, alpha } from '../data/teams.js'
import { share } from '../composables/useShare.js'
import { statLine } from './spotlight.js'

const props = defineProps({
  player: { type: Object, required: true },
  label: { type: String, required: true },
  to: { type: String, default: null },
})

const t = computed(() => team(props.player.abbr))
const sec = computed(() => accent(props.player.abbr))

const style = computed(() => {
  const c = t.value?.color ?? '#646a72'
  return {
    '--team': c,
    '--sec': sec.value,
    '--bg': `linear-gradient(120deg, ${darken(c, .55)} 0%, ${c} 55%, ${darken(c, .85)} 100%)`,
    '--glow': alpha(sec.value, .28),
    '--wm': alpha(sec.value, .1),
  }
})

const line = computed(() => `${statLine(props.player)} · ${props.player.min} MIN`)

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
  <section class="hero" :style="style" :aria-label="label" :title="`Game Score ${player.gs}`">
    <span class="wm wm-a" aria-hidden="true"></span>
    <span class="wm wm-b" aria-hidden="true"></span>

    <header class="strip">
      <div class="brand">
        <BrandLockup mini />
        <span class="rule" aria-hidden="true"></span>
        <h2 class="label">{{ label }}</h2>
      </div>
      <button type="button" class="share" @click="onShare"><span aria-hidden="true">↗</span>{{ copied ? 'Copied' : 'Share' }}</button>
    </header>

    <div class="body">
      <JerseyMark class="jersey" :abbr="player.abbr" :num="player.num" :color="t?.color ?? '#646a72'" :trim="sec" />
      <div class="who">
        <component :is="to ? 'RouterLink' : 'div'" :to="to ?? undefined" class="name">{{ player.name }}</component>
        <div class="team">{{ t?.name ?? player.abbr }}</div>
        <div class="line">{{ line }}</div>
      </div>
      <StatTrio class="trio" hero :accent="sec" :pts="player.pts" :reb="player.reb" :ast="player.ast" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, .08);
  color: #fff;
  background:
    repeating-linear-gradient(135deg, rgba(255, 255, 255, .03) 0 1px, transparent 1px 14px),
    radial-gradient(60% 80% at 0% 0%, rgba(255, 255, 255, .08), transparent 60%),
    radial-gradient(90% 120% at 85% 110%, var(--glow), transparent 60%),
    var(--bg);
  /* Scoped tokens so nested components (StatTrio) read on the team colour. */
  --fg: #fff;
  --mu: rgba(255, 255, 255, .8);
  --ln: rgba(255, 255, 255, .22);
}
.wm {
  position: absolute;
  background: var(--wm);
  -webkit-mask: url('../assets/brand/ball-lines-thin.png') center / contain no-repeat;
  mask: url('../assets/brand/ball-lines-thin.png') center / contain no-repeat;
  pointer-events: none;
}
.wm-a { width: 260px; height: 260px; left: -110px; top: -40px; transform: rotate(-34deg); }
.wm-b { width: 330px; height: 330px; right: -30px; bottom: -70px; transform: rotate(18deg); }

.strip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, .12);
}
.brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
.rule { width: 1px; height: 16px; background: rgba(255, 255, 255, .3); flex: none; }
.label {
  margin: 0;
  font: 600 11px var(--mono);
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--sec);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.share {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex: none;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, .3);
  background: rgba(255, 255, 255, .08);
  color: #fff;
  font: 600 10px var(--sans);
  cursor: pointer;

  & span { font-size: 11px; }
  &:hover { background: rgba(255, 255, 255, .18); }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
}

.body {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 24px;
  align-items: center;
  padding: 16px 26px 20px;
}
.who { min-width: 0; align-self: start; }
.name {
  display: block;
  font: 800 32px/1 var(--sans);
  letter-spacing: -.035em;
}
a.name:hover { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }
a.name:focus-visible { outline: 2px solid #fff; outline-offset: 3px; border-radius: 2px; }
.team { font: 500 12px var(--mono); letter-spacing: .06em; opacity: .85; margin-top: 10px; }
.line { font: 400 12px var(--mono); letter-spacing: .04em; opacity: .75; margin-top: 10px; }

@media (max-width: 760px) {
  .strip { padding: 10px 16px; }
  .body {
    grid-template-columns: auto 1fr;
    gap: 14px 18px;
    padding: 14px 16px 18px;
  }
  .who { align-self: center; }
  .name { font-size: 24px; }
  .team { margin-top: 6px; font-size: 11px; }
  .line { margin-top: 6px; font-size: 11px; }
  .trio { grid-column: 1 / -1; justify-self: center; --trio-size: 48px; }
}
@media (max-width: 420px) {
  .rule, .brand :deep(.lockup) { display: none; }
}
</style>
