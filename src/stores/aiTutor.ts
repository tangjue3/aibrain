import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, TutorStep } from '@/api/types'

export const useAiTutorStore = defineStore('aiTutor', () => {
  const conversation = ref<Message[]>([])
  const isOpen = ref(false)
  const isLoading = ref(false)
  const currentSteps = ref<TutorStep[]>([])
  const errorContext = ref<{ code: string; errorLog: string; nodeId?: string } | null>(null)

  const lastMessages = computed(() => conversation.value.slice(-50))

  const sendMessage = (context: any) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: context.content || context.selectedText || '',
      type: 'text',
      timestamp: Date.now(),
      payload: context
    }
    conversation.value.push(userMsg)
    isLoading.value = true
  }

  const addAssistantMessage = (content: string, type: Message['type'] = 'text', payload?: any) => {
    const msg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content,
      type,
      timestamp: Date.now(),
      payload
    }
    conversation.value.push(msg)
    isLoading.value = false
  }

  const attachError = (ctx: { code: string; errorLog: string; nodeId?: string }) => {
    errorContext.value = ctx
    const content = `代码执行出错：\n\`\`\`\n${ctx.errorLog}\n\`\`\`\n请帮我分析问题。`
    sendMessage({ type: 'highlight', selectedText: content, nodeId: ctx.nodeId })
  }

  const togglePanel = () => {
    isOpen.value = !isOpen.value
  }

  const clearErrorContext = () => {
    errorContext.value = null
  }

  return {
    conversation,
    isOpen,
    isLoading,
    currentSteps,
    errorContext,
    lastMessages,
    sendMessage,
    addAssistantMessage,
    attachError,
    togglePanel,
    clearErrorContext
  }
})
