<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const menuItems = [
  { path: '/onboarding', name: '画像采集', icon: '🎯' },
  { path: '/dashboard', name: '学习仪表盘', icon: '📊' },
  { path: '/workspace', name: '学习工坊', icon: '💻' },
  { path: '/assessment', name: '评估中心', icon: '📋' },
  { path: '/skill-lab', name: 'Skill工坊', icon: '🔧' },
  { path: '/messages', name: '消息中心', icon: '💬' }
]

const activeIndex = computed(() => {
  const idx = menuItems.findIndex((item) => route.path.startsWith(item.path))
  return idx >= 0 ? idx : 0
})
</script>

<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: route.path.startsWith(item.path) }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="version">v1.0.0</div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-md) 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 12px 20px;
  color: #bfcbd9;
  text-decoration: none;
  font-size: var(--font-size-md);
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
}

.nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  color: #fff;
  background: rgba(64, 158, 255, 0.2);
  border-left-color: var(--color-primary);
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.sidebar-footer {
  padding: var(--spacing-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.version {
  font-size: var(--font-size-xs);
  color: #6b7c93;
  text-align: center;
}
</style>
