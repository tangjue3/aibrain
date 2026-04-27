<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Graph } from '@antv/x6'
import type { GraphNode, GraphEdge } from '@/api/types'
import { useLearningPathStore } from '@/stores/learningPath'
import { useLearningPath } from '@/composables/useLearningPath'

const store = useLearningPathStore()
const { navigate } = useLearningPath()
const containerRef = ref<HTMLElement>()
let graph: Graph | null = null

// Register custom nodes
Graph.registerNode(
  'theory-node',
  {
    inherit: 'rect',
    width: 120,
    height: 60,
    attrs: {
      body: { stroke: '#409EFF', fill: '#ecf5ff', rx: 8, ry: 8 },
      label: { text: '', fontSize: 12, fill: '#303133' }
    }
  },
  true
)

Graph.registerNode(
  'challenge-node',
  {
    inherit: 'polygon',
    size: { width: 100, height: 100 },
    attrs: {
      body: {
        stroke: '#e6a23c',
        fill: '#fdf6ec',
        refPoints: '0,50 50,0 100,50 50,100'
      },
      label: { text: '', fontSize: 12, fill: '#303133' }
    }
  },
  true
)

Graph.registerNode(
  'repair-node',
  {
    inherit: 'rect',
    width: 110,
    height: 55,
    attrs: {
      body: { stroke: '#8b5cf6', fill: '#ede9fe', rx: 12, ry: 12 },
      label: { text: '', fontSize: 11, fill: '#6b21a8' }
    }
  },
  true
)

const renderGraph = () => {
  if (!graph || !containerRef.value) return

  const nodes = store.nodes.map((n) => ({
    id: n.id,
    shape: n.type,
    x: n.x || 100 + Math.random() * 600,
    y: n.y || 100 + Math.random() * 400,
    label: n.label,
    data: n
  }))

  const edges = store.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    attrs: {
      line: {
        stroke: e.recommended ? '#409EFF' : '#c0c4cc',
        strokeWidth: e.recommended ? 3 : 1,
        strokeDasharray: e.recommended ? '' : '5,5'
      }
    }
  }))

  graph.fromJSON({ nodes, edges })
}

const setupGraph = () => {
  if (!containerRef.value) return

  graph = new Graph({
    container: containerRef.value,
    width: containerRef.value.clientWidth,
    height: 500,
    grid: { size: 10, visible: true, type: 'dot' },
    panning: { enabled: true },
    mousewheel: { enabled: true, zoomAtMousePosition: true },
    background: { color: 'transparent' },
    connecting: { router: 'manhattan', connector: 'rounded' }
  })

  graph.on('node:click', ({ node }) => {
    const data = node.getData()
    navigate(data.id)
  })

  renderGraph()
}

watch(() => store.nodes.length, () => {
  if (graph) renderGraph()
})

onMounted(() => {
  setupGraph()
})

onUnmounted(() => {
  graph?.dispose()
})
</script>

<template>
  <div ref="containerRef" class="knowledge-graph" />
</template>

<style scoped>
.knowledge-graph {
  width: 100%;
  height: 500px;
  background: var(--bg-card);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}
</style>
