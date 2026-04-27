<script setup lang="ts">
import { ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { BREAKPOINTS } from '@/utils/constants'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import ChatPanel from '@/components/chat/ChatPanel.vue'
import { useAssessmentStore } from '@/stores/assessment'

const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.MOBILE_MAX}px)`)
const assessmentStore = useAssessmentStore()
const showMobileMenu = ref(false)
</script>

<template>
  <div class="app-layout" :class="{ 'is-mobile': isMobile }">
    <transition name="slide-down">
      <div
        v-if="assessmentStore.hasAlert"
        class="alert-banner"
        :class="`alert-${assessmentStore.alert?.level}`"
        @click="$router.push('/assessment')"
      >
        <span class="alert-icon">⚠</span>
        <span>{{ assessmentStore.alert?.message }}</span>
        <button class="alert-close" @click.stop="assessmentStore.clearAlert()">&times;</button>
      </div>
    </transition>

    <Navbar />
    <div class="layout-body">
      <Sidebar v-if="!isMobile" />
      <main class="main-content">
        <slot />
      </main>
    </div>

    <el-drawer
      v-if="isMobile"
      v-model="showMobileMenu"
      direction="ltr"
      size="260px"
      :with-header="false"
    >
      <Sidebar />
    </el-drawer>

    <ChatPanel />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.alert-banner {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  z-index: 1001;
}

.alert-warning {
  background: var(--color-warning);
  color: #fff;
}

.alert-critical {
  background: var(--color-danger);
  color: #fff;
}

.alert-icon {
  font-size: 16px;
}

.alert-close {
  margin-left: auto;
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
}

.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  background: var(--bg-primary);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
