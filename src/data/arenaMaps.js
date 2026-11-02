// Map art behind the box score scoreboard, keyed by home team. Add an entry
// when a map is supplied; arenas without one get a plain navy card.
//   src        image (rendered 1800px wide)
//   aspect     image height / width
//   baseColor  card color under the map (matches the map's water/background)
//   focal      arena position as a fraction of the image
//   pin        pin + radar color (home team accent)
import chaseCenter from '../assets/maps/chase-center.jpg'
import cryptoArena from '../assets/maps/crypto-arena.jpg'

export default {
  GSW: { src: chaseCenter, aspect: 1019 / 4096, baseColor: '#0e2440', focal: { x: 0.501, y: 0.5 }, pin: '#FFC72C' },
  LAL: { src: cryptoArena, aspect: 1019 / 4096, baseColor: '#0c0a14', focal: { x: 0.29, y: 0.55 }, pin: '#FDB927' },
}
