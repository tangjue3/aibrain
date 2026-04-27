import { ref, onUnmounted } from 'vue'
import wsClient from '@/api/ws'

export function useWebSocket(eventType?: string, context?: Record<string, any>) {
  const isConnected = ref(false)
  const isWeakNetwork = ref(false)
  const cleanupFns: (() => void)[] = []

  const connect = () => {
    wsClient.connect()
    isConnected.value = true
  }

  const send = (payload: any = {}) => {
    if (eventType) {
      wsClient.send(eventType, { ...context, ...payload })
    }
  }

  const onMessage = (handler: (payload: any) => void) => {
    if (!eventType) return
    const unsub = wsClient.onMessage(eventType, handler)
    cleanupFns.push(unsub)
  }

  const subscribe = (type: string, handler: (payload: any) => void) => {
    const unsub = wsClient.onMessage(type, handler)
    cleanupFns.push(unsub)
  }

  onUnmounted(() => {
    cleanupFns.forEach((fn) => fn())
  })

  return { isConnected, isWeakNetwork, connect, send, onMessage, subscribe }
}
