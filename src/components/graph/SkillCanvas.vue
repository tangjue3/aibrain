<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Graph, Addon } from '@antv/x6'
import { useSkillLabStore } from '@/stores/skillLab'
import type { SkillNode } from '@/api/types'
import { SKILL_NODE_TYPES } from '@/utils/constants'

const store = useSkillLabStore()
const containerRef = ref<HTMLElement>()
let graph: Graph | null = null

const nodeColors: Record<string, string> = {
  LLM_Chat: '#409EFF',
  WebSearch: '#67c23a',
  CodeExec: '#e6a23c',
  Branch: '#f56c6c',
  Input: '#909399',
  Output: '#8b5cf6'
}

// Register node types
SKILL_NODE_TYPES.forEach((type) => {
  Graph.registerNode(
    `skill-${type}`,
    {
      inherit: 'rect',
      width: 120,
      height: 50,
      attrs: {
        body: {
          stroke: nodeColors[type],
          fill: nodeColors[type] + '20',
          rx: 8,
          ry: 8
        },
        label: { text: type.replace('_', ' '), fontSize: 12, fill: '#303133' }
      },
      ports: {
        groups: {
          in: { position: 'left', attrs: { circle: { r: 4, fill: '#999' } } },
          out: { position: 'right', attrs: { circle: { r: 4, fill: '#999' } } }
        },
        items: [{ group: 'in' }, { group: 'out' }]
      }
    },
    true
  )
})

const setupGraph = () => {
  if (!containerRef.value) return

  graph = new Graph({
    container: containerRef.value,
    width: containerRef.value.clientWidth,
    height: 500,
    grid: { size: 10, visible: true, type: 'mesh' },
    panning: { enabled: true },
    mousewheel: { enabled: true, zoomAtMousePosition: true },
    background: { color: 'transparent' },
    connecting: {
      router: 'manhattan',
      connector: 'rounded',
      allowBlank: false
    },
    keyboard: { enabled: true }
  })

  graph.on('node:dblclick', ({ node }) => {
    console.log('[SkillCanvas] Node double-clicked:', node.id)
    // Trigger config panel
  })

  graph.on('edge:connected', ({ edge }) => {
    const source = edge.getSourceCellId()
    const target = edge.getTargetCellId()
    if (source && target) {
      store.addEdge({ id: edge.id, source, target })
    }
  })

  renderCanvas()
}

const renderCanvas = () => {
  if (!graph) return

  const nodes = store.canvasNodes.map((n) => ({
    id: n.id,
    shape: `skill-${n.type}`,
    x: n.x,
    y: n.y,
    label: n.config?.label || n.type
  }))

  const edges = store.canvasEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target
  }))

  graph.fromJSON({ nodes, edges })
}

// Handle drop from toolbar
const onDrop = (e: DragEvent) => {
  e.preventDefault()
  if (!graph) return
  const type = e.dataTransfer?.getData('nodeType')
  if (!type) return

  const point = graph.clientToLocal(e.clientX, e.clientY)
  const node: SkillNode = {
    id: `node_${Date.now()}`,
    type: type as SkillNode['type'],
    x: point.x - 60,
    y: point.y - 25
  }
  store.addNode(node)
  graph.addNode({
    id: node.id,
    shape: `skill-${type}`,
    x: node.x,
    y: node.y
  })
}

const deleteSelected = () => {
  if (!graph) return
  const cells = graph.getSelectedCells()
  cells.forEach((cell) => {
    store.removeNode(cell.id)
    graph?.removeCell(cell)
  })
}

watch(() => store.canvasNodes.length, () => renderCanvas())

onMounted(() => setupGraph())
onUnmounted(() => graph?.dispose())

defineExpose({ onDrop, deleteSelected })
</script>

<template>
  <div class="skill-canvas-wrapper">
    <!-- Toolbar -->
    <div class="canvas-toolbar">
      <div
        v-for="type in SKILL_NODE_TYPES"
        :key="type"
        class="toolbar-item"
        draggable="true"
        @dragstart="(e) => e.dataTransfer?.setData('nodeType', type)"
        :style="{ borderColor: nodeColors[type] }"
      >
        {{ type.replace('_', ' ') }}
      </div>
      <div class="toolbar-separator" />
      <button class="toolbar-action" @click="deleteSelected">🗑 删除选中</button>
      <button class="toolbar-action" @click="store.clearCanvas()">🔄 清空</button>
    </div>

    <!-- Canvas -->
    <div
      ref="containerRef"
      class="canvas-container"
      @drop="onDrop"
      @dragover.prevent
    />

    <!-- Legend -->
    <div class="canvas-legend">
      <div v-for="type in SKILL_NODE_TYPES" :key="type" class="legend-item">
        <span class="legend-dot" :style="{ background: nodeColors[type] }" />
        <span>{{ type.replace('_', ' ') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skill-canvas-wrapper {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.toolbar-item {
  padding: 4px 12px;
  border: 2px solid #ccc;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  cursor: grab;
  user-select: none;
  transition: transform var(--transition-fast);
}

.toolbar-item:hover {
  transform: scale(1.05);
}

.toolbar-item:active {
  cursor: grabbing;
}

.toolbar-separator {
  width: 1px;
  height: 24px;
  background: var(--border-color);
  margin: 0 var(--spacing-sm);
}

.toolbar-action {
  padding: 4px 12px;
  background: var(--bg-hover);
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-regular);
  cursor: pointer;
}

.toolbar-action:hover {
  background: var(--border-light);
}

.canvas-container {
  width: 100%;
  height: 500px;
}

.canvas-legend {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
