<script setup>
// Centered title block with labelled prev/next pills. Used on the day
// overview (pills step through days) and the box score (pills step through
// that night's games).
//   prev / next: { to, label, text, aria }, { disabled: true, label, text }
//   (shown dimmed, not a link) or null (side left empty)
defineProps({
  tag: { type: String, required: true }, // "Last night"
  tagTo: { type: String, default: null }, // makes the eyebrow a link
  title: { type: String, required: true }, // "Sun, Nov 1"
  sub: { type: String, default: '' },
  subTo: { type: String, default: null }, // makes the sub line a link
  subLink: { type: String, default: '' }, // trailing link text: "· All games"
  prev: { type: Object, default: null },
  next: { type: Object, default: null },
})
</script>

<template>
  <nav class="pagenav" aria-label="Navigation">
    <component
      :is="prev.disabled ? 'span' : 'RouterLink'"
      v-if="prev"
      :to="prev.disabled ? undefined : prev.to"
      class="side prev"
      :class="{ disabled: prev.disabled }"
      :aria-label="prev.aria"
      :aria-hidden="prev.disabled ? 'true' : undefined"
    >
      <span class="arrow" aria-hidden="true">◀</span>
      <span class="txt"><span class="lbl">{{ prev.label }}</span><span class="val">{{ prev.text }}</span></span>
    </component>
    <span v-else class="side empty" aria-hidden="true"></span>

    <div class="mid">
      <RouterLink v-if="tagTo" :to="tagTo" class="eyebrow tag-link">{{ tag }}</RouterLink>
      <div v-else class="eyebrow">{{ tag }}</div>
      <h1 class="title">{{ title }}</h1>
      <!-- Always rendered so the block keeps its height while data loads. -->
      <RouterLink v-if="subTo" :to="subTo" class="sub sub-link">{{ sub }}<span v-if="subLink" class="sub-more">{{ subLink }}</span></RouterLink>
      <div v-else class="sub">{{ sub || '\u00a0' }}</div>
    </div>

    <component
      :is="next.disabled ? 'span' : 'RouterLink'"
      v-if="next"
      :to="next.disabled ? undefined : next.to"
      class="side next"
      :class="{ disabled: next.disabled }"
      :aria-label="next.aria"
      :aria-hidden="next.disabled ? 'true' : undefined"
    >
      <span class="txt"><span class="lbl">{{ next.label }}</span><span class="val">{{ next.text }}</span></span>
      <span class="arrow" aria-hidden="true">▶</span>
    </component>
    <span v-else class="side empty" aria-hidden="true"></span>
  </nav>
</template>

<style scoped>
.pagenav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;
  padding-top: 28px;
}
.side {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  border: 1px solid var(--ln);
  border-radius: 999px;
  background: var(--sf);

  transition: transform .15s ease;

  &:not(.disabled):hover { border-color: var(--mu); }
  &:focus-visible { outline: 2px solid var(--ac); outline-offset: 2px; }
}
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  a.side:hover { transform: scale(1.02); }
}
.prev { justify-self: start; padding: 6px 16px 6px 6px; }
.next { justify-self: end; padding: 6px 6px 6px 16px; }
.disabled { opacity: .35; }
.empty { visibility: hidden; }
.arrow {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--ln2);
  display: grid;
  place-items: center;
  font-size: 10px;
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
.val { min-height: 1.3em; font: 600 12px/1.3 var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.mid { text-align: center; }
/* Block-level so the link version sits exactly where the plain label does. */
.eyebrow { letter-spacing: .14em; }
.tag-link { display: table; margin: 0 auto; }
.tag-link:hover { text-decoration: underline; }
.title {
  font: 800 34px/1.1 var(--sans);
  letter-spacing: -.03em;
  margin: 4px 0 0;
}
.sub { font-size: 15px; line-height: 1.4; color: var(--mu); margin-top: 6px; }
.sub-link { display: inline-flex; align-items: baseline; gap: 6px; font-size: 13px; }
.sub-link:hover { color: var(--ac); }
.sub-more { font-size: 11px; }

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
  .sub { font-size: 13px; }
}
</style>
