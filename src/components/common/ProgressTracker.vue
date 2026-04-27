<script setup lang="ts">
defineProps<{
  percent: number
  status?: 'idle' | 'loading' | 'done' | 'error'
  label?: string
}>()

defineEmits<{ cancel: [] }>()
</script>

<template>
  <div class="progress-tracker">
    <div class="progress-ring">
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="42" />
        <circle
          class="ring-fill"
          :class="status"
          cx="50"
          cy="50"
          r="42"
          :stroke-dasharray="2 * Math.PI * 42"
          :stroke-dashoffset="2 * Math.PI * 42 * (1 - percent / 100)"
        />
      </svg>
      <span class="progress-text">{{ Math.round(percent) }}%</span>
    </div>
    <p v-if="label" class="progress-label">{{ label }}</p>
    <button
      v-if="status === 'loading'"
      class="cancel-btn"
      @click="$emit('cancel')"
    >
      取消
    </button>
  </div>
</template>

<style scoped>
.progress-tracker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
}

.progress-ring {
  position: relative;
  width: 80px;
  height: 80px;
}

.progress-ring svg {
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--border-light);
  stroke-width: 6;
}

.ring-fill {
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.ring-fill.error {
  stroke: var(--color-danger);
}

.ring-fill.done {
  stroke: var(--color-success);
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.progress-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.cancel-btn {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  background: none;
  border: 1px solid var(--color-danger);
  border-radius: var(--border-radius-sm);
  padding: 4px 12px;
  cursor: pointer;
}
</style>
