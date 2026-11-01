import { ref, computed } from 'vue'

// Sortable rows. `value(row, key)` returns the number to sort by.
// Clicking a new column sorts descending; clicking the active one flips it.
// Ties break on PTS desc, then name.
export function useSort(rows, value, initial = 'pts') {
  const sort = ref({ key: initial, dir: -1 })

  function setSort(key) {
    sort.value = sort.value.key === key ? { key, dir: -sort.value.dir } : { key, dir: -1 }
  }

  const sorted = computed(() => {
    const { key, dir } = sort.value
    return rows.value.slice().sort((a, b) =>
      dir * (value(a, key) - value(b, key)) || value(b, 'pts') - value(a, 'pts') || a.name.localeCompare(b.name))
  })

  return { sort, setSort, sorted }
}
