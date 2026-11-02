<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const open = ref(false)

const links = [
  { to: '/', label: 'Scores', section: 'scores' },
  { to: '/players', label: 'Players', section: 'players' },
  { to: '/teams', label: 'Teams', section: 'teams' },
  { to: '/standings', label: 'Standings', section: 'standings' },
]
const section = computed(() => route.meta.section)

watch(() => route.fullPath, () => { open.value = false })
</script>

<template>
  <header class="header">
    <div class="bar">
      <RouterLink to="/" class="wordmark" aria-label="dunkfu home">dunk<span>fu</span></RouterLink>
      <nav class="nav" aria-label="Main">
        <RouterLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :class="{ active: section === l.section }"
          :aria-current="section === l.section ? 'page' : undefined"
        >{{ l.label }}</RouterLink>
      </nav>
      <div class="end">
        <ThemeToggle />
        <button
          type="button"
          class="menu-btn"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          aria-label="Menu"
          @click="open = !open"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path v-if="open" d="M6 6l12 12M18 6L6 18" />
            <path v-else d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </div>
    <nav v-if="open" id="mobile-nav" class="mobile-nav" aria-label="Main">
      <RouterLink
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        :class="{ active: section === l.section }"
      >{{ l.label }}</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  border-bottom: 1px solid var(--ln);
  background: var(--bg);
}
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px var(--gutter);
  max-width: var(--max);
  margin: 0 auto;
}
.wordmark {
  font: 800 24px/1 var(--sans);
  letter-spacing: -.03em;

  & span { font-weight: 400; color: var(--ac); }
}
.nav {
  display: flex;
  gap: 26px;
  font-size: 13px;
  font-weight: 600;
  color: var(--mu);

  & a:hover, & a.active { color: var(--fg); }
}
.end { display: flex; align-items: center; gap: 8px; }
.menu-btn, .mobile-nav { display: none; }

@media (max-width: 720px) {
  .bar { padding-top: 14px; padding-bottom: 14px; }
  .wordmark { font-size: 20px; }
  .nav { display: none; }
  .menu-btn {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: 50%;
    border: 1px solid var(--ln);
    background: transparent;
    color: var(--mu);
    cursor: pointer;
  }
  .mobile-nav {
    display: grid;
    border-top: 1px solid var(--ln2);
    padding: 4px 0;

    & a {
      padding: 12px 18px;
      font: 600 14px var(--sans);
      color: var(--mu);
    }
    & a.active { color: var(--fg); }
  }
}
</style>
