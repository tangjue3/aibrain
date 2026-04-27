import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Exercise, TreeNode } from '@/api/types'

export interface TreeNode {
  name: string
  children?: TreeNode[]
}

export const useWorkspaceStore = defineStore('workspace', () => {
  const rawMarkdown = ref('')
  const isStreaming = ref(false)
  const mindmapData = ref<TreeNode | null>(null)
  const currentExercise = ref<Exercise | null>(null)
  const generationProgress = ref({ percent: 0, status: 'idle' })
  const currentNodeId = ref<string>('')

  const appendMarkdown = (chunk: string) => {
    rawMarkdown.value += chunk
  }

  const reset = () => {
    rawMarkdown.value = ''
    isStreaming.value = false
    mindmapData.value = null
    currentExercise.value = null
    generationProgress.value = { percent: 0, status: 'idle' }
  }

  return {
    rawMarkdown,
    isStreaming,
    mindmapData,
    currentExercise,
    generationProgress,
    currentNodeId,
    appendMarkdown,
    reset
  }
})
