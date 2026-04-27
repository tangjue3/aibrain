<script setup lang="ts">
import { useTypewriter } from '@/composables/useStreaming'

const props = defineProps<{
  text: string
  speed?: number
}>()

const { displayedText, isAnimating } = useTypewriter(
  () => props.text,
  { speed: props.speed || 30 }
)
</script>

<template>
  <div class="typing-bubble" :class="{ animating: isAnimating }">
    <div class="bubble-content">{{ displayedText }}</div>
    <span v-if="isAnimating" class="cursor">▍</span>
  </div>
</template>

<style scoped>
.typing-bubble {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  line-height: 1.6;
  word-break: break-word;
}

.bubble-content {
  display: inline;
}

.cursor {
  display: inline;
  color: var(--color-primary);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Markdown content styling */
.bubble-content :deep(p) {
  margin-bottom: var(--spacing-sm);
}

.bubble-content :deep(code) {
  background: var(--bg-hover);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

.bubble-content :deep(pre) {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  overflow-x: auto;
}

.bubble-content :deep(pre code) {
  background: none;
  padding: 0;
}
</style>
