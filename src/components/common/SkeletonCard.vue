<script setup lang="ts">
defineProps<{ rows?: number }>()
</script>

<template>
  <div class="skeleton-card">
    <div class="skeleton-line skeleton-title" />
    <div
      v-for="i in rows || 3"
      :key="i"
      class="skeleton-line"
      :style="{ width: `${80 - (i - 1) * 15}%` }"
    />
  </div>
</template>

<style scoped>
.skeleton-card {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, var(--border-light) 25%, var(--bg-hover) 50%, var(--border-light) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-sm);
}

.skeleton-title {
  height: 20px;
  width: 60%;
  margin-bottom: var(--spacing-md);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
