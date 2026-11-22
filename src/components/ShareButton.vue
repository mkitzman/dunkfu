<script setup>
// Icon-only share button for the award modules (rev 6). The status
// ("Copied image") shows beside it and is announced by useShareImage.
// With a mouse it appears only while its card (class "share-host") is hovered
// or has keyboard focus inside; touch screens can't hover, so it always shows.
//   tone: 'page' on --sf surfaces, 'team' on a team-colour hero
defineProps({
  label: { type: String, required: true }, // "Share Breakout"
  status: { type: String, default: '' },
  tone: { type: String, default: 'page' },
})
defineEmits(['click'])
</script>

<template>
  <span class="share" :class="[`t-${tone}`, { busy: status }]">
    <span v-if="status" class="st" aria-hidden="true">{{ status }}</span>
    <button type="button" :aria-label="label" :title="label" @click="$emit('click', $event)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>
    </button>
  </span>
</template>

<style scoped>
.share { display: inline-flex; align-items: center; gap: 8px; flex: none; }
.st { font: 500 10px var(--mono); letter-spacing: .04em; white-space: nowrap; }
button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--ln);
  background: var(--sf);
  color: var(--mu);
  cursor: pointer;

  & svg { width: 13px; height: 13px; }
  &:hover { border-color: var(--mu); color: var(--fg); }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
}
@media (hover: hover) {
  /* The whole card shares on click (useShareImage.shareFromCard). */
  :global(.share-host) { cursor: pointer; transition: scale .2s ease; }
  :global(.share-host:hover) { scale: 1.01; }
  .share { opacity: 0; transition: opacity .15s; }
  .share-host:hover .share,
  .share-host:focus-within .share,
  .share.busy { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .share { transition: none; }
  :global(.share-host), :global(.share-host:hover) { transition: none; scale: none; }
}
.t-page .st { color: var(--mu); }
.t-team .st { color: rgba(255, 255, 255, .85); }
.t-team button {
  border-color: rgba(255, 255, 255, .3);
  background: rgba(255, 255, 255, .08);
  color: #fff;

  &:hover { background: rgba(255, 255, 255, .18); border-color: rgba(255, 255, 255, .3); }
  &:focus-visible { outline-color: #fff; }
}
</style>
