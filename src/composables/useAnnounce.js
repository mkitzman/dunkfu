import { ref, nextTick } from 'vue'

// One polite live region for the whole app (rendered in App.vue). Pages call
// announce() after in-page navigation so screen readers hear what changed.
export const announcement = ref('')

export async function announce(text) {
  announcement.value = ''
  await nextTick() // clear first so repeating the same text is still read
  announcement.value = text
}
