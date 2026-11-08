<script setup>
// Gear button in the header: a small panel with the theme and the viewer's
// favourite team. Closes on Escape, an outside click or a second press.
import { ref, computed, nextTick, onBeforeUnmount, useId } from 'vue'
import SegmentedControl from './SegmentedControl.vue'
import { useTheme } from '../composables/useTheme.js'
import { favorite, setFavorite } from '../composables/useFavorite.js'
import { teams, team, accent } from '../data/teams.js'

const { theme, toggle } = useTheme()
const themeValue = computed({ get: () => theme.value, set: v => v !== theme.value && toggle() })
const THEMES = [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]

const NONE = { abbr: null, name: 'None' }
const options = [NONE, ...teams.slice().sort((a, b) => a.name.localeCompare(b.name))]
const current = computed(() => team(favorite.value) ?? NONE)
const swatch = t => (t.abbr ? { '--a': t.color, '--b': accent(t.abbr) } : null)

const open = ref(false)
const listOpen = ref(false)
const root = ref(null)
const btn = ref(null)
const listBtn = ref(null)
const optionEls = ref([])
const id = useId()

function onDoc(e) {
  if (!root.value?.contains(e.target)) close()
}
function onKey(e) {
  if (e.key !== 'Escape') return
  if (listOpen.value) { listOpen.value = false; listBtn.value?.focus() } else { close(); btn.value?.focus() }
}
function close() {
  open.value = false
  listOpen.value = false
  document.removeEventListener('pointerdown', onDoc)
  document.removeEventListener('keydown', onKey)
}
function toggleMenu() {
  if (open.value) return close()
  open.value = true
  document.addEventListener('pointerdown', onDoc)
  document.addEventListener('keydown', onKey)
}
onBeforeUnmount(close)

// Team list: listbox of options; arrow keys move, Enter/click picks.
async function toggleList() {
  listOpen.value = !listOpen.value
  if (!listOpen.value) return
  await nextTick()
  const i = Math.max(0, options.findIndex(o => o.abbr === favorite.value))
  optionEls.value[i]?.scrollIntoView({ block: 'center' })
  optionEls.value[i]?.focus()
}
// Changes apply immediately, so picking a team closes the whole menu.
function pick(t) {
  setFavorite(t.abbr)
  close()
  btn.value?.focus()
}
function onListKey(e, i) {
  const step = { ArrowDown: 1, ArrowUp: -1, Home: -Infinity, End: Infinity }[e.key]
  if (step == null) return
  e.preventDefault()
  const j = Math.min(options.length - 1, Math.max(0, i + step))
  optionEls.value[j]?.focus()
}
</script>

<template>
  <div ref="root" class="settings">
    <button
      ref="btn"
      type="button"
      class="gear"
      aria-label="Settings"
      :aria-expanded="open"
      :aria-controls="id"
      @click="toggleMenu"
    >
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </button>

    <div v-show="open" :id="id" class="panel" role="dialog" aria-label="Settings">
      <div class="row">
        <span class="lbl">Theme</span>
        <SegmentedControl v-model="themeValue" :options="THEMES" label="Theme" class="seg" />
      </div>

      <div class="sep"></div>

      <div class="field">
        <span :id="`${id}-fav`" class="lbl">Favorite team</span>
        <button
          ref="listBtn"
          type="button"
          class="select"
          :aria-expanded="listOpen"
          :aria-labelledby="`${id}-fav ${id}-cur`"
          aria-haspopup="listbox"
          @click="toggleList"
        >
          <span class="sw" :class="{ none: !current.abbr }" :style="swatch(current)" aria-hidden="true"></span>
          <span :id="`${id}-cur`" class="cur">{{ current.name }}</span>
          <span class="caret" aria-hidden="true">▾</span>
        </button>
        <ul v-if="listOpen" class="list" role="listbox" :aria-labelledby="`${id}-fav`">
          <li
            v-for="(t, i) in options"
            :key="t.abbr ?? 'none'"
            ref="optionEls"
            role="option"
            tabindex="-1"
            :aria-selected="t.abbr === favorite"
            class="opt"
            @click="pick(t)"
            @keydown.enter.prevent="pick(t)"
            @keydown.space.prevent="pick(t)"
            @keydown="onListKey($event, i)"
          >
            <span class="sw" :class="{ none: !t.abbr }" :style="swatch(t)" aria-hidden="true"></span>
            <span class="nm">{{ t.name }}</span>
            <svg v-if="t.abbr === favorite" class="check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </li>
        </ul>
        <p class="hint">Highlights their games and players, and lists their conference and division first.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings { position: relative; }
.gear {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--ln);
  background: transparent;
  color: var(--mu);
  display: grid;
  place-items: center;
  cursor: pointer;

  &:hover, &[aria-expanded="true"] { color: var(--fg); border-color: var(--mu); }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
}
.panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 20;
  width: 300px;
  max-width: calc(100vw - 2 * var(--gutter));
  padding: 14px;
  background: var(--sf);
  border: 1px solid var(--ln);
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, .3);
  text-align: left;
}
.row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.lbl {
  font: 500 10px var(--mono);
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--mu);
}
.seg { font-size: 12px; }
.sep { height: 1px; background: var(--ln); margin: 14px -14px; }
.field { display: grid; gap: 8px; }

.select {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid var(--ln);
  background: var(--bg);
  color: var(--fg);
  font: 600 14px var(--sans);
  text-align: left;
  cursor: pointer;

  &:hover, &[aria-expanded="true"] { border-color: var(--mu); }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
}
.cur { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.caret { font-size: 11px; color: var(--mu); }

.list {
  list-style: none;
  margin: 0;
  padding: 4px;
  max-height: 280px;
  overflow-y: auto;
  border: 1px solid var(--ln);
  border-radius: 10px;
  background: var(--bg);
  overscroll-behavior: contain;
}
.opt {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 7px;
  font: 500 13px var(--sans);
  cursor: pointer;

  &:hover, &:focus { background: var(--ln2); outline: none; }
  &:focus-visible { box-shadow: inset 0 0 0 2px var(--ac); }
  &[aria-selected="true"] { font-weight: 700; }
}
.nm { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.check { color: var(--ac); flex: none; }

/* Two-tone team swatch: primary | accent. */
.sw {
  flex: none;
  width: 22px;
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--a) 0 60%, var(--b) 60% 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .12);

  &.none { background: transparent; box-shadow: inset 0 0 0 1px var(--ln); }
}
.hint { margin: 2px 0 0; font: 400 11px/1.5 var(--sans); color: var(--mu); }
</style>
