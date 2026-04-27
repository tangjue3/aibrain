import { useAiTutorStore } from '@/stores/aiTutor'

export function useAITutor() {
  const store = useAiTutorStore()

  const askWithHighlight = (selectedText: string, nodeId?: string) => {
    store.sendMessage({
      type: 'highlight',
      selectedText,
      nodeId,
      content: `请解释：${selectedText}`
    })
  }

  const askWithError = (code: string, errorLog: string, nodeId?: string) => {
    store.attachError({ code, errorLog, nodeId })
  }

  return { askWithHighlight, askWithError, store }
}
