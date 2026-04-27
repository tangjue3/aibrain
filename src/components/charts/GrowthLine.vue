<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useDarkMode } from '@/composables/useDarkMode'

const props = defineProps<{
  data: { date: string; score: number }[]
}>()

const { isDark } = useDarkMode()
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const getOption = (): echarts.EChartsOption => ({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: props.data.map((d) => d.date),
    axisLabel: { color: isDark.value ? '#b0b8c8' : '#606266', fontSize: 11 }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    axisLabel: { color: isDark.value ? '#b0b8c8' : '#606266', fontSize: 11 }
  },
  series: [{
    type: 'line',
    data: props.data.map((d) => d.score),
    smooth: true,
    lineStyle: { color: '#409EFF', width: 2 },
    itemStyle: { color: '#409EFF' },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(64,158,255,0.3)' },
        { offset: 1, color: 'rgba(64,158,255,0.02)' }
      ])
    }
  }],
  grid: { top: 20, right: 20, bottom: 30, left: 40 }
})

const render = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, isDark.value ? 'dark' : undefined)
  chart.setOption(getOption())
}

watch(() => props.data, () => {
  chart?.setOption(getOption())
}, { deep: true })

watch(isDark, () => {
  chart?.dispose()
  render()
})

onMounted(() => render())
onUnmounted(() => chart?.dispose())
</script>

<template>
  <div ref="chartRef" class="growth-line" style="width:100%;height:300px" />
</template>

<style scoped>
.growth-line {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}
</style>
