import { ref, watchEffect } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  storageKey: 'aibrain-theme',
  valueDark: 'dark',
  valueLight: 'light'
})
const toggleDark = useToggle(isDark)

export function useDarkMode() {
  const dark = ref(isDark.value)

  watchEffect(() => {
    dark.value = isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  })

  const toggle = () => {
    toggleDark()
  }

  return { isDark: dark, toggle }
}
