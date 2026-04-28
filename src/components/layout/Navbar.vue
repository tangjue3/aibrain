<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDarkMode } from '@/composables/useDarkMode'
import { useMessageCenterStore } from '@/stores/messageCenter'

const { isDark, toggle } = useDarkMode()
const msgStore = useMessageCenterStore()
const route = useRoute()

const menuItems = [
  { path: '/onboarding', name: '画像采集' },
  { path: '/dashboard', name: '学习仪表盘' },
  { path: '/workspace', name: '学习工坊' },
  { path: '/assessment', name: '评估中心' },
  { path: '/skill-lab', name: 'Skill工坊' },
  { path: '/messages', name: '消息中心' }
]
</script>

<template>
  <header class="navbar">
    <div class="navbar-left">
      <router-link to="/dashboard" class="logo">
        <span class="logo-text">智学脑 AIBrain</span>
      </router-link>
    </div>

    <nav class="navbar-center">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-menu-item"
        :class="{ active: route.path.startsWith(item.path) }"
      >
        {{ item.name }}
      </router-link>
    </nav>

    <div class="navbar-right">
      <button class="nav-btn" :aria-label="isDark ? '切换亮色' : '切换暗色'" @click="toggle">
        <svg v-if="isDark" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <button class="nav-btn bell-btn" aria-label="消息通知" @click="$router.push('/messages')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span v-if="msgStore.hasUnread" class="badge">{{ msgStore.unreadCount }}</span>
      </button>

      <el-dropdown trigger="click">
        <button class="nav-btn avatar-btn">
          <el-avatar :size="32" icon="UserFilled" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item>学习记录</el-dropdown-item>
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  height: var(--navbar-height);
  padding: 0 var(--spacing-lg);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: var(--font-size-lg);
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: var(--spacing-xs);
}

.nav-menu-item {
  padding: 8px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-md);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
}

.nav-menu-item:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.nav-menu-item.active {
  color: var(--color-primary);
  background: rgba(64, 158, 255, 0.1);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--border-radius-sm);
  background: transparent;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-icon {
  width: 18px;
  height: 18px;
}

.bell-btn {
  position: relative;
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: var(--color-danger);
  color: #fff;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  border-radius: 8px;
}

.avatar-btn {
  padding: 2px;
}
</style>
