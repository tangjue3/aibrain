import { ref, watch, onUnmounted } from 'vue'

export function useTypewriter(text: () => string, options: { speed?: number } = {}) {
  const speed = options.speed || 30
  const displayedText = ref('')
  const isAnimating = ref(false)
  let timer: number | null = null
  let frameId: number | null = null

  const animate = (target: string) => {
    if (displayedText.value === target) {
      isAnimating.value = false
      return
    }
    isAnimating.value = true
    let index = displayedText.value.length

    const step = () => {
      if (index < target.length) {
        displayedText.value += target[index]
        index++
        timer = window.setTimeout(() => {
          frameId = requestAnimationFrame(step)
        }, speed)
      } else {
        isAnimating.value = false
      }
    }
    step()
  }

  const finishImmediately = () => {
    if (timer) clearTimeout(timer)
    if (frameId) cancelAnimationFrame(frameId)
    displayedText.value = text()
    isAnimating.value = false
  }

  watch(
    text,
    (newText, oldText) => {
      if (timer) clearTimeout(timer)
      if (frameId) cancelAnimationFrame(frameId)
      // If new message, finish current immediately
      if (oldText && newText !== oldText && !newText.startsWith(oldText)) {
        displayedText.value = oldText || ''
        finishImmediately()
      }
      animate(newText)
    },
    { immediate: true }
  )

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
    if (frameId) cancelAnimationFrame(frameId)
  })

  return { displayedText, isAnimating, finishImmediately }
}
