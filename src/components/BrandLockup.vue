<script setup>
// dunkfu lockup (T2): ball · wordmark · hairline · two-line tagline.
// `mini` is the card-header version: ball + wordmark only, always on a dark
// team background. Brand orange never changes with team or theme.
defineProps({ mini: Boolean })
</script>

<template>
  <span class="lockup" :class="{ mini }">
    <span class="ball" aria-hidden="true"></span>
    <span class="word">dunk<span class="fu">fu</span></span>
    <span v-if="!mini" class="tag" aria-hidden="true">Last night<br>in the NBA</span>
  </span>
</template>

<style scoped>
.lockup { display: inline-flex; align-items: center; white-space: nowrap; }
.ball {
  flex: none;
  width: 24px;
  height: 24px;
  margin-right: 9px;
  background: var(--brand);
  -webkit-mask: url('../assets/brand/ball-solid-black.png') center / contain no-repeat;
  mask: url('../assets/brand/ball-solid-black.png') center / contain no-repeat;
}
.word {
  font: 800 30px/1 var(--sans);
  letter-spacing: -.045em;
  color: var(--fg);
}
.fu { color: var(--brand); }
.tag {
  font: 500 9px/1.5 var(--mono);
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--fg);
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px solid var(--ln);
}

.mini .ball { width: 13px; height: 13px; margin-right: 5px; }
.mini .word { font-size: 16px; color: #f4f1ea; }

@media (max-width: 720px) {
  .lockup:not(.mini) .ball { width: 20px; height: 20px; margin-right: 7px; }
  .lockup:not(.mini) .word { font-size: 24px; }
}
@media (max-width: 380px) {
  .tag { display: none; }
}
</style>
