import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import './styles/tokens.css'

// Column hover for every table (row hover is plain CSS, see tokens.css):
// mark each cell in the hovered cell's column with .col-hl. Mouse only.
let cur = null, marked = []
const clear = () => { for (const c of marked) c.classList.remove('col-hl'); marked = []; cur = null }
document.addEventListener('pointerover', e => {
  if (e.pointerType !== 'mouse') return
  const cell = e.target.closest?.('td, th'), table = cell?.closest('table')
  if (!table || cell.colSpan > 1) return clear()
  let x = 0
  for (const c of cell.parentElement.cells) { if (c === cell) break; x += c.colSpan }
  if (cur?.table === table && cur.x === x) return
  clear()
  cur = { table, x }
  for (const row of table.rows) {
    let i = 0
    for (const c of row.cells) {
      if (i === x && c.colSpan === 1) { c.classList.add('col-hl'); marked.push(c) }
      if ((i += c.colSpan) > x) break
    }
  }
})

createApp(App).use(router).mount('#app')
