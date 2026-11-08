<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="wrap row">
      <span>© {{ year }} dunkfu</span>
      <span>Not affiliated with the NBA or its teams.</span>
      <span>
        Map data ©
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>,
        © <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a>,
        tiles by <a href="https://openfreemap.org/" target="_blank" rel="noopener">OpenFreeMap</a>
      </span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--ln);
  margin-top: 24px;
}
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  gap: 6px 22px;
  padding-top: 18px;
  padding-bottom: 24px;
  font: 400 11px/1.6 var(--mono);
  color: var(--mu);

  & a { color: inherit; text-decoration: underline; text-underline-offset: 2px; }
  & a:hover { color: var(--fg); }
}
</style>
