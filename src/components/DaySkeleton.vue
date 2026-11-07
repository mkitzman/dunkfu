<script setup>
// Placeholder for the day overview while its data loads: the scores panel
// with three game cards, the spotlight hero and dud, and the table top.
</script>

<template>
  <div class="skeleton" aria-busy="true">
    <span class="sr-only">Loading games…</span>

    <div class="panel" aria-hidden="true">
      <div class="strip"><span class="bar w-35"></span></div>
      <div class="games">
      <div v-for="i in 3" :key="i" class="card game">
        <span class="bar w-12"></span>
        <div v-for="r in 2" :key="r" class="row">
          <span class="dot"></span>
          <span class="stack"><span class="bar w-60"></span><span class="bar w-80 thin"></span></span>
          <span class="bar w-q"></span>
        </div>
      </div>
      </div>
    </div>

    <div class="card hero" aria-hidden="true">
      <span class="bar w-35"></span>
      <div class="row">
        <span class="jersey"></span>
        <span class="stack"><span class="bar w-50 tall"></span><span class="bar w-35 thin"></span><span class="bar w-60 thin"></span></span>
        <span class="bar big"></span>
      </div>
    </div>

    <div class="card dud" aria-hidden="true">
      <div class="row">
        <span class="bar w-12"></span>
        <span class="stack"><span class="bar w-35 tall"></span><span class="bar w-50 thin"></span></span>
        <span class="bar mid"></span>
      </div>
    </div>

    <div class="card table" aria-hidden="true">
      <div class="head"><span class="bar w-12"></span><span class="bar w-head"></span></div>
      <div v-for="r in 4" :key="r" class="trow">
        <span class="stack"><span class="bar w-20"></span><span class="bar w-10 thin"></span></span>
        <span class="bar w-head"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton { display: grid; gap: 26px; padding-bottom: 48px; }
.panel {
  --ln: rgba(255, 255, 255, .16);
  --ln2: rgba(255, 255, 255, .06);
  --sf: rgba(255, 255, 255, .06);
  background: #0e2440;
  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 14px;
  overflow: hidden;
}
.strip { padding: 14px 22px; border-bottom: 1px solid rgba(255, 255, 255, .12); }
.games {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
  padding: 16px;
}

.game { padding: 16px; display: grid; gap: 14px; border-radius: 10px; }
.hero { padding: 16px 26px 22px; display: grid; gap: 18px; border-radius: 16px; }
.dud { padding: 18px 24px; border-radius: 14px; }
.jersey { width: 68px; height: 85px; border-radius: 10px; background: var(--ln2); flex: none; }
.row { display: flex; align-items: center; gap: 10px; }
.stack { display: grid; gap: 6px; flex: 1; }
.dot { width: 24px; height: 24px; border-radius: 50%; background: var(--ln2); flex: none; }

.table { overflow: hidden; }
.head, .trow { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 14px 16px; }
.head { background: var(--ln2); }
.trow { border-top: 1px solid var(--ln2); padding: 16px; }

/* Shimmering placeholder bars */
.bar {
  display: block;
  height: 10px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--ln2) 0%, var(--ln) 50%, var(--ln2) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
.bar.thin { height: 8px; }
.bar.tall { height: 14px; }
.bar.big { width: 220px; height: 60px; }
.bar.mid { width: 140px; height: 32px; }
.w-10 { width: 10%; } .w-12 { width: 60px; } .w-20 { width: 22%; } .w-35 { width: 35%; }
.w-50 { width: 50%; } .w-60 { width: 60%; } .w-80 { width: 80%; }
.w-q { width: 150px; height: 14px; }
.w-head { width: 55%; }
@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .bar { animation: none; }
}

@media (max-width: 720px) {
  .skeleton { gap: 16px; }
  .games { grid-template-columns: 1fr; padding: 12px; }
  .games > :not(:first-child) { display: none; }
  .bar.big { width: 110px; height: 28px; }
  .bar.mid { display: none; }
  .jersey { width: 48px; height: 60px; }
  .hero { padding: 14px 16px 18px; }
  .w-q { width: 100px; }
}
</style>
