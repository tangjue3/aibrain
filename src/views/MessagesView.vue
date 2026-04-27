<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMessageCenterStore, type Notification } from '@/stores/messageCenter'
import { timeAgo } from '@/utils/format'

const store = useMessageCenterStore()
const activeFilter = ref<'all' | 'intervention_task' | 'teacher_reply' | 'system_alert'>('all')

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') return store.notifications
  return store.notifications.filter((n) => n.type === activeFilter.value)
})

const typeLabels: Record<string, string> = {
  intervention_task: '📋 教师任务',
  teacher_reply: '💬 教师回复',
  system_alert: '⚠️ 系统预警'
}

const typeFilters = [
  { value: 'all' as const, label: '全部' },
  { value: 'intervention_task' as const, label: '📋 教师任务' },
  { value: 'teacher_reply' as const, label: '💬 教师回复' },
  { value: 'system_alert' as const, label: '⚠️ 预警' }
]

onMounted(() => {
  // Demo notifications
  if (store.notifications.length === 0) {
    store.addNotification({
      type: 'intervention_task',
      title: '栈与队列-单元测试',
      description: '教师布置了单元测试，截止时间：4月30日 23:59'
    })
    store.addNotification({
      type: 'teacher_reply',
      title: '关于递归问题的回复',
      description: '老师回复了你的求助：建议先理解递归终止条件...'
    })
    store.addNotification({
      type: 'system_alert',
      title: '学习预警提醒',
      description: '检测到连续3次代码错误率超过60%，建议回顾基础知识'
    })
  }
})

const handleAction = (notif: Notification) => {
  store.markAsRead(notif.id)
  if (notif.type === 'intervention_task') {
    // Navigate to task
    console.log('[Messages] Navigate to:', notif.payload?.nodeId)
  }
}
</script>

<template>
  <div class="messages-page">
    <div class="page-header">
      <h2>💬 消息中心</h2>
      <div class="header-actions">
        <button
          v-if="store.hasUnread"
          class="mark-all-btn"
          @click="store.markAllRead()"
        >
          全部已读
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <button
        v-for="f in typeFilters"
        :key="f.value"
        class="filter-btn"
        :class="{ active: activeFilter === f.value }"
        @click="activeFilter = f.value"
      >
        {{ f.label }}
        <span
          v-if="f.value === 'all' && store.unreadCount > 0"
          class="filter-badge"
        >
          {{ store.unreadCount }}
        </span>
      </button>
    </div>

    <!-- Notifications list -->
    <div v-if="filteredNotifications.length === 0" class="empty-state">
      <p>📭 暂无消息</p>
    </div>
    <div v-else class="notification-list">
      <div
        v-for="notif in filteredNotifications"
        :key="notif.id"
        class="notification-card"
        :class="{ unread: !notif.read }"
        @click="handleAction(notif)"
      >
        <div class="notif-header">
          <span class="notif-type">{{ typeLabels[notif.type] }}</span>
          <span class="notif-time">{{ timeAgo(notif.timestamp) }}</span>
          <span v-if="!notif.read" class="unread-dot" />
        </div>
        <h4 class="notif-title">{{ notif.title }}</h4>
        <p class="notif-desc">{{ notif.description }}</p>
        <div v-if="notif.type === 'intervention_task'" class="notif-action">
          <button>立即开始 →</button>
        </div>
      </div>
    </div>

    <!-- Pending help requests -->
    <div v-if="store.pendingHelpRequests.size > 0" class="section">
      <h3>🆘 待回复求助</h3>
      <div class="pending-list">
        <div
          v-for="nodeId in [...store.pendingHelpRequests]"
          :key="nodeId"
          class="pending-item"
        >
          <span>节点 {{ nodeId }} - 等待教师回复中...</span>
          <span class="pending-status">⏳</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.messages-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.page-header h2 {
  font-size: var(--font-size-xl);
  color: var(--text-primary);
}

.mark-all-btn {
  padding: 6px 16px;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  color: var(--text-regular);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.filter-bar {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-regular);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  position: relative;
}

.filter-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.filter-badge {
  margin-left: 4px;
  background: #fff;
  color: var(--color-primary);
  padding: 0 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.notification-card {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
}

.notification-card:hover {
  box-shadow: var(--shadow-md);
}

.notification-card.unread {
  border-left-color: var(--color-primary);
  background: var(--bg-hover);
}

.notif-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.notif-type {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.notif-time {
  font-size: var(--font-size-xs);
  color: var(--text-placeholder);
  margin-left: auto;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
}

.notif-title {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  margin-bottom: 4px;
}

.notif-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.notif-action {
  margin-top: var(--spacing-sm);
}

.notif-action button {
  padding: 4px 12px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: var(--font-size-xs);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
}

.section {
  margin-top: var(--spacing-xl);
  background: var(--bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
}

.section h3 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.pending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-hover);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
