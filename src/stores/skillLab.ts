import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SkillNode, SkillEdge, CoTStep } from '@/api/types'

export interface SkillCase {
  id: string
  title: string
  description: string
  tags: string[]
  steps: string[]
  presetCode?: string
}

export const useSkillLabStore = defineStore('skillLab', () => {
  const cases = ref<SkillCase[]>([])
  const canvasNodes = ref<SkillNode[]>([])
  const canvasEdges = ref<SkillEdge[]>([])
  const currentSkillId = ref<string | null>(null)
  const isExecuting = ref(false)
  const cotSteps = ref<CoTStep[]>([])

  const setCases = (data: SkillCase[]) => {
    cases.value = data
  }

  const addNode = (node: SkillNode) => {
    canvasNodes.value.push(node)
  }

  const removeNode = (id: string) => {
    canvasNodes.value = canvasNodes.value.filter((n) => n.id !== id)
    canvasEdges.value = canvasEdges.value.filter(
      (e) => e.source !== id && e.target !== id
    )
  }

  const addEdge = (edge: SkillEdge) => {
    canvasEdges.value.push(edge)
  }

  const removeEdge = (id: string) => {
    canvasEdges.value = canvasEdges.value.filter((e) => e.id !== id)
  }

  const updateNodeConfig = (id: string, config: Record<string, any>) => {
    const node = canvasNodes.value.find((n) => n.id === id)
    if (node) node.config = config
  }

  const serializeCanvas = () => ({
    nodes: canvasNodes.value,
    edges: canvasEdges.value
  })

  const loadCanvas = (data: { nodes: SkillNode[]; edges: SkillEdge[] }) => {
    canvasNodes.value = data.nodes
    canvasEdges.value = data.edges
  }

  const addCoTStep = (step: CoTStep) => {
    cotSteps.value.push(step)
  }

  const clearCanvas = () => {
    canvasNodes.value = []
    canvasEdges.value = []
    cotSteps.value = []
  }

  return {
    cases,
    canvasNodes,
    canvasEdges,
    currentSkillId,
    isExecuting,
    cotSteps,
    setCases,
    addNode,
    removeNode,
    addEdge,
    removeEdge,
    updateNodeConfig,
    serializeCanvas,
    loadCanvas,
    addCoTStep,
    clearCanvas
  }
})
