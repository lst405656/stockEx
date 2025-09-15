<template>
  <div class="chart-wrap" :style="{ height: height + 'px', width }">
    <VChart
      ref="chartRef"
      :option="mergedOption"
      :theme="theme || undefined"
      :autoresize="true"
    />
    <div v-if="loading" class="overlay">로딩 중…</div>
    <div v-else-if="empty" class="overlay empty">{{ emptyText }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  GridComponent, TooltipComponent, LegendComponent, TitleComponent, AriaComponent
} from 'echarts/components'
import { GaugeChart, LineChart, BarChart, PieChart } from 'echarts/charts'

/* 필요한 모듈 등록(여기 한곳에서만) */
use([CanvasRenderer, GridComponent, TooltipComponent, LegendComponent, TitleComponent, AriaComponent,
     GaugeChart, LineChart, BarChart, PieChart])

const props = defineProps({
  option: { type: Object, required: true },
  height: { type: Number, default: 260 },
  width:  { type: String,  default: '100%' },
  loading:{ type: Boolean, default: false },
  empty:  { type: Boolean, default: false },
  emptyText: { type: String, default: '데이터가 없습니다.' },
  theme:  { type: [String, Object], default: '' }
})

/* 프로젝트 공통 기본 옵션 */
const baseOption = {
  textStyle: { fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto' },
  animationDuration: 500,
  tooltip: { show: true, appendToBody: true }
}
const mergedOption = computed(() => ({ ...baseOption, ...props.option }))

const chartRef = ref(null)
const getInstance = () => chartRef.value?.chart
defineExpose({ getInstance })
</script>

<style scoped>
.chart-wrap { position: relative; }
.overlay {
  position:absolute; inset:0; display:grid; place-items:center;
  background: rgba(255,255,255,.6); backdrop-filter: blur(2px);
  font-size:.95rem; color:#6b7280; border-radius: 8px;
}
.empty { background: transparent; }
</style>
