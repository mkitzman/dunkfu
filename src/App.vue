<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import PlayerCard from './components/PlayerCard.vue'
import { announcement } from './composables/useAnnounce.js'

const main = ref(null)
const router = useRouter()

// Skip link: straight past the header to the page content.
function skip() {
  main.value.focus()
}

// Route changes in a single-page app don't move focus or tell screen readers
// anything, so after navigating to a different page, focus its <h1> (or
// <main> if it has none). Steps within a page (day to day, game to game,
// standings views) keep focus where it is; those pages announce changes.
let first = true
router.afterEach(async (to, from, failure) => {
  if (failure) return
  if (first) { first = false; return }
  if (to.matched[0]?.components?.default === from.matched[0]?.components?.default) return
  // Pages may render their <h1> after data loads; wait briefly for it.
  let h1 = null
  for (let t = 0; t < 60 && !h1; t++) {
    await new Promise(r => setTimeout(r, 50))
    h1 = main.value?.querySelector('h1')
  }
  // Don't pull focus away from something the user has moved to meanwhile.
  const a = document.activeElement
  if (a && a !== document.body && !a.closest('header, footer')) return
  const el = h1 ?? main.value
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
})
</script>

<template>
  <a href="#main" class="skip" @click.prevent="skip">Skip to content</a>
  <AppHeader />
  <main id="main" ref="main" tabindex="-1">
    <RouterView />
  </main>
  <AppFooter />
  <PlayerCard />
  <div class="sr-only" aria-live="polite" aria-atomic="true">{{ announcement }}</div>
</template>
