import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GraphNode, GraphEdge } from '@/api/types'

export const useLearningPathStore = defineStore('learningPath', () => {
  const nodes = ref<GraphNode[]>([])
  const edges = ref<GraphEdge[]>([])
  const currentNodeId = ref<string | null>(null)
  const completedNodeIds = ref<Set<string>>(new Set())

  const totalNodes = computed(() => nodes.value.length)
  const completedNodes = computed(() =>
    nodes.value.filter((n) => completedNodeIds.value.has(n.id))
  )
  const completionRate = computed(() =>
    totalNodes.value > 0
      ? Math.round((completedNodeIds.value.size / totalNodes.value) * 100)
      : 0
  )

  const getNode = (id: string) => nodes.value.find((n) => n.id === id)

  const getUnmetPrerequisites = (nodeId: string): string[] => {
    const node = getNode(nodeId)
    if (!node) return []
    return node.prerequisites.filter((preId) => !completedNodeIds.value.has(preId))
  }

  const updateFromGraph = (newNodes: GraphNode[], newEdges: GraphEdge[]) => {
    nodes.value = newNodes
    edges.value = newEdges
  }

  const addNode = (node: GraphNode) => {
    const idx = nodes.value.findIndex((n) => n.id === node.id)
    if (idx >= 0) {
      nodes.value[idx] = node
    } else {
      nodes.value.push(node)
    }
  }

  const markCompleted = (nodeId: string) => {
    completedNodeIds.value.add(nodeId)
    const node = getNode(nodeId)
    if (node) node.completed = true
  }

  const setCurrentNode = (nodeId: string | null) => {
    currentNodeId.value = nodeId
  }

  return {
    nodes,
    edges,
    currentNodeId,
    completedNodeIds,
    totalNodes,
    completedNodes,
    completionRate,
    getNode,
    getUnmetPrerequisites,
    updateFromGraph,
    addNode,
    markCompleted,
    setCurrentNode
  }
})
