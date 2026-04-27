import { ref } from 'vue'
import { useWebSocket } from './useWebSocket'

export function useCodeExecution() {
  const running = ref(false)
  const lastResult = ref<any>(null)
  const { send, subscribe, onMessage } = useWebSocket('code_execute')

  const run = (code: string, language: string, nodeId?: string): Promise<any> => {
    if (running.value) return Promise.reject(new Error('已有代码在运行'))

    running.value = true
    send({ code, language, nodeId })

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        running.value = false
        cleanup()
        reject(new Error('代码执行超时 (15s)'))
      }, 15000)

      const cleanup = subscribe('execution_result', (payload) => {
        clearTimeout(timeout)
        running.value = false
        lastResult.value = payload
        resolve(payload)
        cleanup()
      })
    })
  }

  return { running, lastResult, run }
}
