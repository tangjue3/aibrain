<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAssessmentStore } from '@/stores/assessment'
import { useUserProfileStore } from '@/stores/userProfile'
import RadarChart from '@/components/charts/RadarChart.vue'
import GrowthLine from '@/components/charts/GrowthLine.vue'
import Heatmap from '@/components/charts/Heatmap.vue'
import AIDisclaimer from '@/components/common/AIDisclaimer.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import { formatDate, formatPercent } from '@/utils/format'
import type { AssessmentReport } from '@/api/types'

const assessmentStore = useAssessmentStore()
const userStore = useUserProfileStore()
const isLoading = ref(true)

// Demo data
onMounted(() => {
  setTimeout(() => {
    // Growth data
    assessmentStore.setGrowthData([
      { date: '3/1', score: 45 }, { date: '3/8', score: 52 },
      { date: '3/15', score: 58 }, { date: '3/22', score: 63 },
      { date: '3/29', score: 68 }, { date: '4/5', score: 72 },
      { date: '4/12', score: 76 }, { date: '4/19', score: 80 }
    ])

    // Heatmap data
    const concepts = ['栈', '队列', '链表', '树', '图', '排序', '递归', '动态规划']
    const dates = ['4/20', '4/21', '4/22', '4/23', '4/24', '4/25', '4/26']
    const heatData: [string, string, number][] = []
    concepts.forEach((c) => {
      dates.forEach((d) => {
        heatData.push([d, c, Math.floor(Math.random() * 60) + 30])
      })
    })
    assessmentStore.setHeatmapData(heatData)

    // Mock report
    const report: AssessmentReport = {
      generatedAt: new Date().toISOString(),
      unitId: 'unit_stack_queue',
      masteryHeatmap: concepts.map((c) => ({ concept: c, level: Math.floor(Math.random() * 60) + 30 })),
      errorFrequency: [
        { type: '边界条件', count: 12 },
        { type: '逻辑错误', count: 8 },
        { type: '空指针', count: 5 },
        { type: '类型错误', count: 3 }
      ],
      efficiencyScore: 78,
      suggestions: [
        '加强递归思维训练，多做树和图相关题目',
        '注意栈与队列的边界条件处理',
        '建议每天保持1小时以上的编程练习'
      ]
    }
    assessmentStore.addReport(report)

    isLoading.value = false
  }, 600)
})
</script>

<template>
  <div class="assessment-page">
    <h2 class="page-title">📋 学习效果多维评估</h2>

    <!-- Alert -->
    <div v-if="assessmentStore.hasAlert" class="alert-section">
      <div class="alert-card" :class="`alert-${assessmentStore.alert?.level}`">
        <span class="alert-icon">⚠️</span>
        <div>
          <strong>{{ assessmentStore.alert?.message }}</strong>
          <p v-if="assessmentStore.alert?.weakPoints?.length">
            薄弱知识点：{{ assessmentStore.alert?.weakPoints?.join('、') }}
          </p>
        </div>
        <button @click="assessmentStore.clearAlert()">知道了</button>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <div class="chart-card">
        <h3>🎯 能力雷达图</h3>
        <RadarChart :width="320" :height="320" />
      </div>
      <div class="chart-card">
        <h3>📈 成长曲线</h3>
        <GrowthLine :data="assessmentStore.growthData" />
      </div>
    </div>

    <!-- Heatmap -->
    <div class="chart-card full-width">
      <h3>🗺 知识点掌握度热力图</h3>
      <SkeletonCard v-if="isLoading" :rows="8" />
      <Heatmap v-else :data="assessmentStore.heatmapData" type="matrix" />
    </div>

    <!-- Latest Report -->
    <div class="chart-card full-width" v-if="assessmentStore.latestReport">
      <h3>📝 最新测评报告</h3>
      <div class="report-body">
        <div class="report-meta">
          <span>生成时间：{{ formatDate(assessmentStore.latestReport.generatedAt) }}</span>
          <span>效率评分：<strong>{{ formatPercent(assessmentStore.latestReport.efficiencyScore) }}</strong></span>
        </div>

        <div class="report-section">
          <h4>错误类型分布</h4>
          <div class="err-list">
            <div
              v-for="err in assessmentStore.latestReport.errorFrequency"
              :key="err.type"
              class="err-item"
            >
              <span class="err-type">{{ err.type }}</span>
              <div class="err-bar">
                <div
                  class="err-fill"
                  :style="{
                    width: `${(err.count / assessmentStore.latestReport.errorFrequency[0].count) * 100}%`
                  }"
                />
              </div>
              <span class="err-count">{{ err.count }}次</span>
            </div>
          </div>
        </div>

        <div class="report-section">
          <h4>改进建议</h4>
          <ul class="suggestions">
            <li v-for="s in assessmentStore.latestReport.suggestions" :key="s">
              {{ s }}
            </li>
          </ul>
        </div>

        <AIDisclaimer source="评估反馈智能体" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.assessment-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--font-size-xl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.alert-section {
  margin-bottom: var(--spacing-lg);
}

.alert-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
}

.alert-card.alert-warning {
  background: #fdf6ec;
  border-left: 4px solid var(--color-warning);
}

.alert-card.alert-critical {
  background: #fef0f0;
  border-left: 4px solid var(--color-danger);
}

.alert-card p {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: 4px;
}

.alert-card button {
  margin-left: auto;
  padding: 6px 16px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

@media (max-width: 767px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
}

.chart-card h3 {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.chart-card.full-width {
  margin-bottom: var(--spacing-md);
}

.report-body {
  padding: var(--spacing-md) 0;
}

.report-meta {
  display: flex;
  gap: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.report-section {
  margin-bottom: var(--spacing-lg);
}

.report-section h4 {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.err-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.err-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.err-type {
  width: 80px;
  font-size: var(--font-size-sm);
  color: var(--text-regular);
  flex-shrink: 0;
}

.err-bar {
  flex: 1;
  height: 8px;
  background: var(--border-light);
  border-radius: 4px;
  overflow: hidden;
}

.err-fill {
  height: 100%;
  background: var(--color-warning);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.err-count {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.suggestions {
  padding-left: 20px;
}

.suggestions li {
  font-size: var(--font-size-sm);
  color: var(--text-regular);
  margin-bottom: 4px;
}
</style>
