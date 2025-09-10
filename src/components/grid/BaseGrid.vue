<template>
  <!-- 컨테이너 태그 커스텀 가능 -->
  <component :is="as" class="grid" :style="gridStyle">
    <!-- 비어있을 때 -->
    <slot name="empty" v-if="!items || !items.length">
      <!-- 기본 empty UI (원하면 slot으로 대체) -->
      <div class="grid__empty">데이터가 없습니다.</div>
    </slot>

    <!-- 아이템 렌더 -->
    <component
      v-else
      v-for="(it, i) in items"
      :key="keyOf(it, i)"
      :is="itemTag"
      class="grid__item"
      :class="itemClass"
      :style="itemStyle"
    >
      <!-- 기본 슬롯: 카드 템플릿 -->
      <slot :item="it" :index="i">
        <!-- 기본 대체 템플릿 -->
        <pre>{{ it }}</pre>
      </slot>
    </component>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 렌더할 데이터 */
  items: { type: Array, default: () => [] },

  /** 고정 컬럼 수. 설정 시 이 값 우선 */
  cols: { type: [Number, String], default: null },

  /** 반응형: 카드 최소 너비. 예: 220 또는 '240px'
   *  grid-template-columns: repeat(auto-fit, minmax(minColWidth, 1fr))
   */
  minColWidth: { type: [Number, String], default: 220 },

  /** 간격 */
  gap: { type: String, default: '12px' },
  rowGap: { type: String, default: '' },
  colGap: { type: String, default: '' },

  /** 컨테이너/아이템 태그 & 클래스/스타일 */
  as: { type: String, default: 'div' },
  itemTag: { type: String, default: 'div' },
  itemClass: { type: [String, Array, Object], default: '' },
  itemStyle: { type: [String, Object], default: '' },

  /** 키 결정: 문자열(필드명) 또는 함수 (it, i) => key */
  itemKey: { type: [String, Function], default: null },

  /** 정렬 옵션(필요 시 사용) */
  alignItems: { type: String, default: 'stretch' },   // start | center | end | stretch
  justifyItems: { type: String, default: 'stretch' }, // start | center | end | stretch
})

/** px 포맷 */
function toPx(v) {
  if (v == null || v === '') return ''
  return typeof v === 'number' ? `${v}px` : v
}

const gridStyle = computed(() => {
  const style = {
    display: 'grid',
    alignItems: props.alignItems,
    justifyItems: props.justifyItems,
  }
  // 간격
  if (props.rowGap || props.colGap) {
    if (props.rowGap) style.rowGap = props.rowGap
    if (props.colGap) style.columnGap = props.colGap
  } else {
    style.gap = props.gap
  }
  // 컬럼 규칙
  if (props.cols != null && props.cols !== '') {
    style.gridTemplateColumns = `repeat(${props.cols}, minmax(0, 1fr))`
  } else {
    const minw = toPx(props.minColWidth) || '220px'
    style.gridTemplateColumns = `repeat(auto-fit, minmax(${minw}, 1fr))`
  }
  return style
})

function keyOf(it, i) {
  if (!props.itemKey) return i
  if (typeof props.itemKey === 'function') return props.itemKey(it, i)
  return it?.[props.itemKey] ?? i
}
</script>

<style scoped>
.grid { width: 100%; }
.grid__item { min-width: 0; } /* 카드 내부 텍스트 말줄임 등에 필요 */
.grid__empty { color:#6b7280; font-size:.9rem; padding: 12px 0; }
</style>
