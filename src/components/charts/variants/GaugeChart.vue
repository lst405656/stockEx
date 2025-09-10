<template>
  <BaseChart :option="option" :height="height" :theme="theme" :loading="loading" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'

const props = defineProps({
  value: { type: Number, default: 50 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  startAngle: { type: Number, default: 210 },   // 시계 방향, 0=우측
  endAngle: { type: Number, default: -30 },
  thickness: { type: Number, default: 20 },
  height: { type: Number, default: 300 },
  theme:  { type: [String, Object], default: '' },
  loading:{ type: Boolean, default: false },
  // [[stop(0~1), color], ...]
  segments: {
    type: Array,
    default: () => [
      [0.2, '#ef4444'], [0.4, '#f97316'], [0.6, '#facc15'],
      [0.8, '#22c55e'], [1.0, '#16a34a']
    ]
  },
  pointerColor: { type: String, default: '#0b0f19' },
  ticks: { type: Boolean, default: false }
})

const option = computed(() => ({
  series: [{
    type: 'gauge',
    min: props.min, max: props.max,
    startAngle: props.startAngle, endAngle: props.endAngle,
    axisLine: { lineStyle: { width: props.thickness, color: props.segments } },
    splitLine: { show: props.ticks, length: 10, distance: 0 },
    axisTick:  { show: false },
    axisLabel: { show: false },
    progress:  { show: false },
    pointer:   { show: true, itemStyle: { color: props.pointerColor } },
    anchor:    { show: true, size: 10, itemStyle: { color: props.pointerColor } },
    detail:    { show: false },
    data: [{ value: props.value }]
  }]
}))
</script>
