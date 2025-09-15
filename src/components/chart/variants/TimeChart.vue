<template>
  <BaseChart :option="option" :height="height" :theme="theme" :loading="loading" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'

const props = defineProps({
  /** [{ t: Date|number|string, y: number }] */
  data: { type: Array, default: () => [] },
  name: { type: String, default: '' },
  height: { type: Number, default: 320 },
  theme:  { type: [String, Object], default: '' },
  loading:{ type: Boolean, default: false },

  color: { type: String, default: '#2563eb' },
  area: { type: Boolean, default: false },
  smooth: { type: Boolean, default: false },
  yScale: { type: Boolean, default: true },
  showGrid: { type: Boolean, default: true },
  showTooltip: { type: Boolean, default: true },

  locale: { type: String, default: 'ko-KR' },
  decimals: { type: Number, default: 2 },
})

const points = computed(() =>
  props.data.map(d => [new Date(d.t).getTime(), Number(d.y)])
)

const option = computed(() => {
  const color = props.color
  const gradient = {
    type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: color + '66' },
      { offset: 1, color: color + '00' }
    ]
  }

  return {
    grid: { left: 54, right: 16, top: 24, bottom: 32, containLabel: false },
    xAxis: {
      type: 'time', boundaryGap: false,
      axisLine: { show: false }, axisTick: { show: false },
      splitLine: { show: props.showGrid, lineStyle: { color: '#e5e7eb' } },
      axisLabel: { hideOverlap: true }
    },
    yAxis: {
      type: 'value', scale: props.yScale,
      axisLine: { show: false }, axisTick: { show: false },
      splitLine: { show: props.showGrid, lineStyle: { color: '#e5e7eb' } },
      axisLabel: {
        formatter: (v) => new Intl.NumberFormat(props.locale, {
          maximumFractionDigits: props.decimals
        }).format(v)
      }
    },
    tooltip: props.showTooltip ? {
      trigger: 'axis',
      axisPointer: { type: 'line' },
      valueFormatter: (v) => new Intl.NumberFormat(props.locale, {
        minimumFractionDigits: props.decimals,
        maximumFractionDigits: props.decimals
      }).format(v)
    } : { show: false },
    series: [{
      type: 'line', name: props.name, data: points.value,
      showSymbol: false, sampling: 'lttb', smooth: props.smooth,
      lineStyle: { width: 2, color },
      areaStyle: props.area ? { color: gradient } : undefined
    }]
  }
})
</script>
