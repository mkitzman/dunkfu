<script setup>
defineProps({ title: { type: String, required: true } })
</script>

<template>
  <div class="wrap soon">
    <div class="eyebrow">Coming soon</div>
    <h1>{{ title }}</h1>
    <p>This section isn't built yet. <RouterLink to="/">See last night's scores →</RouterLink></p>
  </div>
</template>

<style scoped>
.soon { padding-top: 48px; padding-bottom: 48px; }
h1 { font: 600 28px/1.1 var(--sans); letter-spacing: -.02em; margin: 4px 0 8px; }
p { color: var(--mu); font-size: 13px; }
a { color: var(--ac); text-decoration: underline; text-underline-offset: 2px; }
</style>
