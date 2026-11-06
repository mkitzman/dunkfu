<script setup>
// Placeholder for the day overview while its data loads: three game cards,
// the two award cards and the top of the player table.
</script>

<template>
  <div class="skeleton" aria-busy="true">
    <span class="sr-only">Loading games…</span>

    <div class="games">
      <div v-for="i in 3" :key="i" class="card game" aria-hidden="true">
        <span class="bar w-12"></span>
        <div v-for="r in 2" :key="r" class="row">
          <span class="dot"></span>
          <span class="stack"><span class="bar w-60"></span><span class="bar w-80 thin"></span></span>
          <span class="bar w-q"></span>
        </div>
      </div>
    </div>

    <div class="awards">
      <div v-for="i in 2" :key="i" class="card award" aria-hidden="true">
        <span class="bar w-35"></span>
        <div class="row">
          <span class="stack"><span class="bar w-50 tall"></span><span class="bar w-35 thin"></span><span class="bar w-60 thin"></span></span>
          <span class="bar big"></span>
        </div>
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
.skeleton { display: grid; gap: 28px; padding-bottom: 28px; }
.games {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}
.awards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

.game { padding: 16px; display: grid; gap: 14px; }
.award { padding: 18px; display: grid; gap: 18px; }
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
.bar.big { width: 160px; height: 40px; }
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

@media (max-width: 1040px) {
  .awards { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .games { grid-template-columns: 1fr; }
  .games > :not(:first-child) { display: none; }
  .bar.big { width: 110px; height: 28px; }
  .w-q { width: 100px; }
}
</style>
