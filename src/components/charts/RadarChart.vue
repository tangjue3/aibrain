<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useUserProfileStore } from '@/stores/userProfile'
import { useDarkMode } from '@/composables/useDarkMode'
import { gsap } from 'gsap'

const props = withDefaults(defineProps<{
  width?: number
  height?: number
}>(), {
  width: 280,
  height: 280
})

const store = useUserProfileStore()
const { isDark } = useDarkMode()
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const getOption = (): echarts.EChartsOption => ({
  radar: {
    center: ['50%', '50%'],
    radius: '65%',
    indicator: store.radarDimensions.map((d) => ({
      name: d.name,
      max: 100
    })),
    axisName: {
      color: isDark.value ? '#b0b8c8' : '#606266',
      fontSize: 11
    },
    splitArea: {
      areaStyle: {
        color: isDark.value
          ? ['rgba(64,158,255,0.02)', 'rgba(64,158,255,0.05)']
          : ['rgba(64,158,255,0.02)', 'rgba(64,158,255,0.05)']
      }
    }
  },
  series: [{
    type: 'radar',
    data: [{
      value: store.radarDimensions.map((d) => store.radarValues[d.key]),
      name: '能力画像',
      areaStyle: {
        color: 'rgba(64,158,255,0.2)'
      },
      lineStyle: {
        color: '#409EFF',
        width: 2
      },
      itemStyle: {
        color: '#409EFF'
      }
    }],
    symbol: 'circle',
    symbolSize: 6
  }]
})

const renderChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, isDark.value ? 'dark' : undefined)
  chart.setOption(getOption())
}

const animateRadar = (dimension: string, value: number) => {
  if (!chart) return
  const idx = store.radarDimensions.findIndex((d) => d.key === dimension)
  if (idx < 0) return

  // GSAP animation for smooth value transition
  const currentData = (chart.getOption() as any)?.series?.[0]?.data?.[0]?.value || [0, 0, 0, 0, 0, 0]
  const target = [...currentData]
  gsap.to({ val: currentData[idx] }, {
    val: value,
    duration: 0.6,
    ease: 'power2.out',
    onUpdate: function () {
      target[idx] = (this as any).targets()[0].val
      chart?.setOption({
        series: [{ data: [{ value: target }] }]
      })
    }
  })
}

watch(() => store.radarValues, (newVals) => {
  if (!chart) return
  const values = store.radarDimensions.map((d) => newVals[d.key])
  chart.setOption({
    series: [{ data: [{ value: values }] }]
  })
}, { deep: true })

watch(isDark, () => {
  chart?.dispose()
  renderChart()
})

onMounted(() => renderChart())

onUnmounted(() => {
  chart?.dispose()
})

defineExpose({ animateRadar })
</script>

<template>
  <div ref="chartRef" class="radar-chart" :style="{ width: `${props.width}px`, height: `${props.height}px` }" />
</template>

<style scoped>
.radar-chart {
  margin: 0 auto;
}
</style>
