<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useLearningPathStore } from '@/stores/learningPath'
import { useUserProfileStore } from '@/stores/userProfile'
import { useAssessmentStore } from '@/stores/assessment'
import KnowledgeGraph from '@/components/graph/KnowledgeGraph.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import { formatPercent } from '@/utils/format'
import type { GraphNode, GraphEdge } from '@/api/types'

const pathStore = useLearningPathStore()
const userStore = useUserProfileStore()
const assessmentStore = useAssessmentStore()
const isLoading = ref(true)

// Simulate demo data
onMounted(() => {
  setTimeout(() => {
    const demoNodes: GraphNode[] = [
      { id: 'n1', label: '数据结构基础', type: 'theory-node', difficulty: 1, prerequisites: [], completed: true, x: 100, y: 200 },
      { id: 'n2', label: '线性表', type: 'theory-node', difficulty: 1, prerequisites: ['n1'], completed: true, x: 250, y: 100 },
      { id: 'n3', label: '栈与队列', type: 'theory-node', difficulty: 2, prerequisites: ['n2'], completed: true, x: 400, y: 200 },
      { id: 'n4', label: '树与二叉树', type: 'theory-node', difficulty: 2, prerequisites: ['n2'], completed: false, x: 400, y: 350 },
      { id: 'n5', label: '图论实战', type: 'challenge-node', difficulty: 3, prerequisites: ['n3', 'n4'], completed: false, x: 600, y: 200 },
      { id: 'n6', label: '排序算法', type: 'challenge-node', difficulty: 2, prerequisites: ['n2'], completed: false, x: 250, y: 350 },
      { id: 'n7', label: '递归强化', type: 'repair-node', difficulty: 2, prerequisites: ['n4'], completed: false, x: 550, y: 400 }
    ]

    const demoEdges: GraphEdge[] = [
      { id: 'e1', source: 'n1', target: 'n2', recommended: true },
      { id: 'e2', source: 'n2', target: 'n3', recommended: true },
      { id: 'e3', source: 'n2', target: 'n4' },
      { id: 'e4', source: 'n3', target: 'n5' },
      { id: 'e5', source: 'n4', target: 'n5' },
      { id: 'e6', source: 'n2', target: 'n6' },
      { id: 'e7', source: 'n4', target: 'n7' }
    ]

    pathStore.updateFromGraph(demoNodes, demoEdges)
    pathStore.completedNodeIds = new Set(['n1', 'n2', 'n3'])
    assessmentStore.weakPoints = ['递归', '图遍历']
    userStore.learningDays = 23
    isLoading.value = false
  }, 800)
})

const statsCards = computed(() => [
  { label: '完成率', value: formatPercent(pathStore.completionRate), icon: '📈', color: '#409EFF' },
  { label: '连续学习', value: `${userStore.learningDays}天`, icon: '🔥', color: '#e6a23c' },
  { label: '薄弱点', value: `${assessmentStore.weakPoints.length}个`, icon: '🎯', color: '#f56c6c' },
  { label: '待完成节点', value: `${pathStore.totalNodes - pathStore.completedNodes.length}个`, icon: '📝', color: '#67c23a' }
])
</script>

<template>
  <div class="dashboard">
    <!-- Stats cards -->
    <div class="stats-row">
      <div
        v-for="card in statsCards"
        :key="card.label"
        class="stat-card"
        :style="{ borderTopColor: card.color }"
      >
        <div class="stat-icon">{{ card.icon }}</div>
        <div class="stat-info">
          <div class="stat-value">{{ card.value }}</div>
          <div class="stat-label">{{ card.label }}</div>
        </div>
      </div>
    </div>

    <!-- Knowledge Graph -->
    <div class="section">
      <div class="section-header">
        <h2>🧭 知识图谱与学习路径</h2>
        <div class="legend">
          <span class="legend-item"><span class="dot" style="background:#409EFF" />理论</span>
          <span class="legend-item"><span class="dot" style="background:#e6a23c" />挑战</span>
          <span class="legend-item"><span class="dot" style="background:#8b5cf6" />补弱</span>
          <span class="legend-item"><span class="dot gray" />已完成</span>
        </div>
      </div>
      <SkeletonCard v-if="isLoading" :rows="8" />
      <KnowledgeGraph v-else />
      <p class="graph-hint">💡 点击节点可进入学习工坊，推荐路径用粗线标示</p>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border-top: 3px solid;
}

.stat-icon {
  font-size: 28px;
}

.stat-value {
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.section {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.section-header h2 {
  font-size: var(--font-size-xl);
  color: var(--text-primary);
}

.legend {
  display: flex;
  gap: var(--spacing-md);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.gray {
  background: #c0c4cc;
}

.graph-hint {
  margin-top: var(--spacing-md);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
