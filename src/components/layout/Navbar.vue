<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'
import { useMessageCenterStore } from '@/stores/messageCenter'
import { useRouter } from 'vue-router'

const { isDark, toggle } = useDarkMode()
const msgStore = useMessageCenterStore()
const router = useRouter()
</script>

<template>
  <header class="navbar">
    <div class="navbar-left">
      <router-link to="/dashboard" class="logo">
        <span class="logo-icon">🧠</span>
        <span class="logo-text">智学脑 AIBrain</span>
      </router-link>
    </div>

    <nav class="navbar-center">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </nav>

    <div class="navbar-right">
      <!-- Dark mode toggle -->
      <button class="nav-btn" :aria-label="isDark ? '切换亮色' : '切换暗色'" @click="toggle">
        {{ isDark ? '☀️' : '🌙' }}
      </button>

      <!-- Message bell -->
      <button class="nav-btn bell-btn" aria-label="消息通知" @click="router.push('/messages')">
        <span class="bell-icon">🔔</span>
        <span v-if="msgStore.hasUnread" class="badge">{{ msgStore.unreadCount }}</span>
      </button>

      <!-- User avatar -->
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
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: var(--font-size-lg);
}

.logo-icon {
  font-size: 24px;
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
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
  font-size: 18px;
  transition: background var(--transition-fast);
}

.nav-btn:hover {
  background: var(--bg-hover);
}

.bell-btn {
  position: relative;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
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
