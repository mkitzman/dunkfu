<script setup>
// Team mark (design C10h, "twill + soft sash"): the team's primary as woven
// jersey fabric with a faint secondary sash. No stitching: the stitched border
// is reserved for award badges, so the two never get confused side by side.
// Colours come from teams.json (seedColor = primary, secondary = sash).
import { computed } from 'vue'
import { team, onColor, luminance } from '../data/teams.js'

const props = defineProps({
  abbr: { type: String, required: true },
  size: { type: Number, default: 26 },
  fontSize: { type: Number, default: 9 },
})

const style = computed(() => {
  const t = team(props.abbr)
  const p = t?.color ?? '#646a72'
  const on = onColor(p)
  const small = props.size < 34
  return {
    '--_s': `${props.size}px`,
    '--_fs': `${props.fontSize}px`,
    '--tm-p': p,
    '--tm-s': t?.secondary ?? p,
    '--tm-on': on,
    '--tm-weave': small ? '2.5px' : '3px',
    '--tm-edge': small ? '1px' : '1.5px',
    // Light primaries get an ink weave; dark letters never get a shadow.
    '--tm-fab': luminance(p) > 0.55 ? 'rgba(0,0,0,.13)' : 'rgba(255,255,255,.17)',
    '--tm-shadow': on === '#ffffff' ? '0 1px 1.5px rgba(0,0,0,.35)' : 'none',
  }
})
</script>

<template>
  <span class="mark" :style="style" aria-hidden="true">{{ abbr }}</span>
</template>

<style scoped>
/* Parents can resize marks responsively via --mark-size / --mark-fs. */
.mark {
  --size: var(--mark-size, var(--_s));
  --tm-sash-edge: color-mix(in srgb, var(--tm-s) 30%, transparent);
  --tm-sash-fill: color-mix(in srgb, var(--tm-s) 14%, transparent);
  width: var(--size);
  height: var(--size);
  border-radius: calc(var(--size) * .29); /* 26px → ~8, 40px → ~11.5 (matches award tiles) */
  overflow: hidden;
  background:
    linear-gradient(135deg,
      transparent 0 36%,
      var(--tm-sash-edge) 36% calc(36% + var(--tm-edge)),
      var(--tm-sash-fill) calc(36% + var(--tm-edge)) calc(64% - var(--tm-edge)),
      var(--tm-sash-edge) calc(64% - var(--tm-edge)) 64%,
      transparent 64%),
    repeating-linear-gradient(135deg, var(--tm-fab) 0 1px, transparent 1px var(--tm-weave)),
    var(--tm-p);
  color: var(--tm-on);
  font-size: var(--mark-fs, var(--_fs));
  display: inline-grid;
  place-items: center;
  flex: none;
  font-family: var(--sans);
  font-weight: 800;
  letter-spacing: .02em;
  line-height: 1;
  text-shadow: var(--tm-shadow);
  user-select: none;
}
</style>
