<script setup lang="ts">
defineProps<{
  options: string[]
}>()

defineEmits<{ select: [option: string] }>()
</script>

<template>
  <div class="quick-reply">
    <button
      v-for="option in options"
      :key="option"
      class="reply-btn"
      @click="$emit('select', option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<style scoped>
.quick-reply {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
}

.reply-btn {
  padding: 8px 16px;
  background: var(--bg-card);
  border: 1px solid var(--color-primary);
  border-radius: 20px;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.reply-btn:hover {
  background: var(--color-primary);
  color: #fff;
}
</style>
