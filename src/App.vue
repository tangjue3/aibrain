<script setup lang="ts">
import { useDarkMode } from './composables/useDarkMode'
import AppLayout from './components/layout/AppLayout.vue'
import ErrorBoundary from './components/common/ErrorBoundary.vue'

useDarkMode()
</script>

<template>
  <ErrorBoundary>
    <AppLayout>
      <router-view />
    </AppLayout>
  </ErrorBoundary>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
}
</style>
