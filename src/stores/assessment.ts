import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AssessmentReport, SystemAlert } from '@/api/types'

export const useAssessmentStore = defineStore('assessment', () => {
  const reports = ref<AssessmentReport[]>([])
  const heatmapData = ref<[string, string, number][]>([])
  const growthData = ref<{ date: string; score: number }[]>([])
  const alert = ref<SystemAlert | null>(null)
  const weakPoints = ref<string[]>([])

  const latestReport = computed(() => reports.value[reports.value.length - 1] || null)

  const hasAlert = computed(() => alert.value !== null)

  const addReport = (report: AssessmentReport) => {
    reports.value.push(report)
    weakPoints.value = report.masteryHeatmap
      .filter((h) => h.level < 40)
      .map((h) => h.concept)
  }

  const setAlert = (a: SystemAlert) => {
    alert.value = a
    if (a.weakPoints) {
      weakPoints.value = a.weakPoints
    }
  }

  const clearAlert = () => {
    alert.value = null
  }

  const setHeatmapData = (data: [string, string, number][]) => {
    heatmapData.value = data
  }

  const setGrowthData = (data: { date: string; score: number }[]) => {
    growthData.value = data
  }

  return {
    reports,
    heatmapData,
    growthData,
    alert,
    weakPoints,
    latestReport,
    hasAlert,
    addReport,
    setAlert,
    clearAlert,
    setHeatmapData,
    setGrowthData
  }
})
