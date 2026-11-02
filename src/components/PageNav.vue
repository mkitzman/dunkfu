<script setup>
// Centered title block with labelled prev/next pills. Used on the day
// overview (pills step through days) and the box score (pills step through
// that night's games).
//   prev / next: { to, label, text, aria } or null (side left empty)
defineProps({
  tag: { type: String, required: true }, // "Last night"
  tagTo: { type: String, default: null }, // makes the eyebrow a link
  title: { type: String, required: true }, // "Sun, Nov 1"
  sub: { type: String, default: '' },
  prev: { type: Object, default: null },
  next: { type: Object, default: null },
})
</script>

<template>
  <nav class="pagenav" aria-label="Navigation">
    <RouterLink v-if="prev" :to="prev.to" class="side prev" :aria-label="prev.aria">
      <span class="arrow" aria-hidden="true">◀</span>
      <span class="txt"><span class="lbl">{{ prev.label }}</span><span class="val">{{ prev.text }}</span></span>
    </RouterLink>
    <span v-else class="side empty" aria-hidden="true"></span>

    <div class="mid">
      <RouterLink v-if="tagTo" :to="tagTo" class="eyebrow tag-link">{{ tag }}</RouterLink>
      <div v-else class="eyebrow">{{ tag }}</div>
      <h1 class="title">{{ title }}</h1>
      <div v-if="sub" class="sub">{{ sub }}</div>
    </div>

    <RouterLink v-if="next" :to="next.to" class="side next" :aria-label="next.aria">
      <span class="txt"><span class="lbl">{{ next.label }}</span><span class="val">{{ next.text }}</span></span>
      <span class="arrow" aria-hidden="true">▶</span>
    </RouterLink>
    <span v-else class="side empty" aria-hidden="true"></span>
  </nav>
</template>

<style scoped>
.pagenav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;
  padding-top: 26px;
}
.side {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  border: 1px solid var(--ln);
  border-radius: 999px;
  background: var(--sf);

  &:hover { border-color: var(--mu); }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
}
.prev { justify-self: start; padding-right: 18px; }
.next { justify-self: end; padding-left: 18px; }
.empty { visibility: hidden; }
.arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ln2);
  display: grid;
  place-items: center;
  font-size: 11px;
  flex: none;
}
.txt { display: grid; gap: 2px; min-width: 0; }
.next .txt { text-align: right; }
.lbl {
  font: 500 9px var(--mono);
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--mu);
}
.val { font: 600 12px var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.mid { text-align: center; }
/* Block-level so the link version sits exactly where the plain label does. */
.tag-link { display: table; margin: 0 auto; }
.tag-link:hover { text-decoration: underline; }
.title {
  font: 800 30px/1.1 var(--sans);
  letter-spacing: -.03em;
  margin: 4px 0 0;
}
.sub { font-size: 12px; color: var(--mu); margin-top: 4px; }

@media (max-width: 860px) {
  .pagenav {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding-top: 18px;
  }
  .mid { grid-column: 1 / -1; grid-row: 1; }
  .empty { display: none; }
  .prev { grid-column: 1; justify-self: stretch; padding-right: 12px; }
  .next { grid-column: 2; justify-self: stretch; justify-content: flex-end; padding-left: 12px; }
  .side { gap: 8px; min-width: 0; }
  .arrow { width: 28px; height: 28px; font-size: 10px; }
  .val { font-size: 11px; }
  .title { font-size: 26px; }
  .sub { font-size: 11px; }
}
</style>
