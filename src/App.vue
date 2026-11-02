<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { announcement } from './composables/useAnnounce.js'
</script>

<template>
  <AppHeader />
  <main>
    <RouterView />
  </main>
  <AppFooter />
  <div class="sr-only" aria-live="polite" aria-atomic="true">{{ announcement }}</div>
</template>
