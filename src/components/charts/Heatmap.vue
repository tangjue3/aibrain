<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useDarkMode } from '@/composables/useDarkMode'

const props = defineProps<{
  data: [string, string, number][]
  type?: 'calendar' | 'matrix'
}>()

const { isDark } = useDarkMode()
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const getOption = (): echarts.EChartsOption => {
  if (props.type === 'calendar') {
    return {
      visualMap: {
        min: 0,
        max: 600,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        inRange: { color: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'] }
      },
      calendar: {
        top: 40,
        left: 30,
        right: 30,
        cellSize: ['auto', 15],
        range: new Date().getFullYear().toString(),
        itemStyle: { borderColor: isDark.value ? '#2e3a50' : '#fff' },
        dayLabel: { color: isDark.value ? '#b0b8c8' : '#606266' },
        monthLabel: { color: isDark.value ? '#b0b8c8' : '#606266' }
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: props.data.map(([date, , score]) => [date, score])
      }]
    }
  }

  // Matrix heatmap
  return {
    tooltip: { position: 'top' },
    grid: { top: 60, right: 20, bottom: 30, left: 100 },
    xAxis: {
      type: 'category',
      data: [...new Set(props.data.map(([, concept]) => concept))],
      splitArea: { show: true }
    },
    yAxis: {
      type: 'category',
      data: [...new Set(props.data.map(([date]) => date))],
      splitArea: { show: true }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      top: 0,
      inRange: { color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'] }
    },
    series: [{
      type: 'heatmap',
      data: props.data.map(([date, concept, score]) => [concept, date, score]),
      label: { show: false },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' }
      }
    }]
  }
}

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
  <div ref="chartRef" class="heatmap" style="width:100%;height:350px" />
</template>

<style scoped>
.heatmap {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}
</style>
