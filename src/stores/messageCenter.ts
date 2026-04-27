import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { InterventionTask } from '@/api/types'

export interface Notification {
  id: string
  type: 'intervention_task' | 'teacher_reply' | 'system_alert'
  title: string
  description: string
  timestamp: number
  read: boolean
  payload?: any
}

export const useMessageCenterStore = defineStore('messageCenter', () => {
  const notifications = ref<Notification[]>([])
  const pendingHelpRequests = ref<Set<string>>(new Set())

  const unreadCount = computed(() =>
    notifications.value.filter((n) => !n.read).length
  )

  const hasUnread = computed(() => unreadCount.value > 0)

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    notifications.value.unshift({
      ...notif,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false
    })
  }

  const markAsRead = (id: string) => {
    const n = notifications.value.find((x) => x.id === id)
    if (n) n.read = true
  }

  const markAllRead = () => {
    notifications.value.forEach((n) => (n.read = true))
  }

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  const addPendingHelp = (nodeId: string) => {
    pendingHelpRequests.value.add(nodeId)
  }

  const removePendingHelp = (nodeId: string) => {
    pendingHelpRequests.value.delete(nodeId)
  }

  return {
    notifications,
    pendingHelpRequests,
    unreadCount,
    hasUnread,
    addNotification,
    markAsRead,
    markAllRead,
    removeNotification,
    addPendingHelp,
    removePendingHelp
  }
})
