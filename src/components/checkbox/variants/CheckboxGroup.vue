<template>
  <div class="cbg" role="group" :aria-labelledby="label ? labelId : undefined">
    <div v-if="label" :id="labelId" class="cbg__label">{{ label }}</div>

    <!-- 전체 선택(옵션) -->
    <label v-if="selectAll" class="cbg__item" :class="{ disabled }">
      <BaseCheckbox
        v-model="allChecked"
        :indeterminate="indeterminate"
        :disabled="disabled"
        @update:modelValue="toggleAll"
      />
      <span>{{ selectAllLabel }}</span>
    </label>

    <!-- 옵션 목록 -->
    <label
      v-for="opt in options"
      :key="keyOf(opt)"
      class="cbg__item"
      :class="{ disabled: disabled || !!opt.disabled }"
    >
      <BaseCheckbox
        :modelValue="isChecked(opt.value)"
        :disabled="disabled || !!opt.disabled"
        @update:modelValue="(v) => toggleItem(opt.value, v)"
      />
      <span>{{ opt.label }}</span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseCheckbox from '../BaseCheckbox.vue'

/**
 * @component CheckboxGroup
 * @description
 * 여러 개의 체크박스를 그룹으로 묶어 선택값 배열을 관리하는 컴포넌트  
 * - `options` 배열을 받아 자동으로 체크박스 렌더링  
 * - `v-model`은 선택된 값들의 배열  
 * - `selectAll` 옵션으로 전체 선택/해제 기능 제공  
 * - 개별 옵션은 `disabled` 가능  
 * - 접근성: role="group", label → aria-labelledby 자동 연결
 *
 * @example
 * <!-- 기본 사용 -->
 * <CheckboxGroup
 *   v-model="selected"
 *   :options="[
 *     { label: '옵션 A', value: 'a' },
 *     { label: '옵션 B', value: 'b' }
 *   ]"
 * />
 *
 * <!-- 전체 선택 포함 -->
 * <CheckboxGroup
 *   v-model="selected"
 *   label="항목 선택"
 *   :options="[
 *     { label: '사과', value: 'apple' },
 *     { label: '바나나', value: 'banana', disabled: true },
 *     { label: '체리', value: 'cherry' }
 *   ]"
 *   select-all
 * />
 */

/**
 * @typedef {Object} CheckboxGroupProps
 * @property {Array} [modelValue=[]] - 선택된 값들의 배열 (v-model)
 * @property {Array<{label:string,value:any,disabled?:boolean}>} [options=[]] - 옵션 목록
 * @property {boolean} [disabled=false] - 그룹 전체 비활성화
 * @property {string} [label=''] - 그룹 라벨 텍스트 (접근성용)
 * @property {string} [name=''] - 네이티브 name 속성
 * @property {boolean} [selectAll=false] - "전체 선택" 체크박스 표시 여부
 * @property {string} [selectAllLabel='전체 선택'] - 전체 선택 라벨
 */
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: '' },
  name: { type: String, default: '' },

  selectAll: { type: Boolean, default: false },
  selectAllLabel: { type: String, default: '전체 선택' }
})

/**
 * @event update:modelValue - 선택 값 배열이 변경될 때 발생
 * @event change - 선택 값 배열이 변경될 때 발생 (추가적인 핸들링용)
 */
const emit = defineEmits(['update:modelValue', 'change'])

/** 그룹 라벨 id (접근성용) */
const labelId = `cbg-${Math.random().toString(36).slice(2,9)}`

/** 현재 선택값 Set */
const set = computed(() => new Set(props.modelValue))

/** 사용 가능한(비활성화되지 않은) 값들 */
const enabledValues = computed(() =>
  props.options.filter(o => !o.disabled).map(o => o.value)
)

/** 전체 선택 여부 */
const allChecked = computed({
  get() {
    if (enabledValues.value.length === 0) return false
    return enabledValues.value.every(v => set.value.has(v))
  },
  set(v) { /* no-op: toggleAll에서 처리 */ }
})

/** 전체 선택 상태가 일부일 경우 indeterminate */
const indeterminate = computed(() => {
  const cnt = enabledValues.value.filter(v => set.value.has(v)).length
  return cnt > 0 && cnt < enabledValues.value.length
})

function keyOf(opt) { return opt.value ?? opt.label }
function isChecked(value) { return set.value.has(value) }

function nextArray(updatedSet) { return Array.from(updatedSet) }

/** 개별 항목 토글 */
function toggleItem(value, checked) {
  const next = new Set(set.value)
  if (checked) next.add(value)
  else next.delete(value)
  const arr = nextArray(next)
  emit('update:modelValue', arr)
  emit('change', arr)
}

/** 전체 선택/해제 */
function toggleAll(checked) {
  const arr = checked ? enabledValues.value.slice() : []
  emit('update:modelValue', arr)
  emit('change', arr)
}
</script>

<style scoped>
.cbg {
  display:flex;
  flex-direction:column;
  gap:.5rem;
}
.cbg__label {
  font-weight:600;
  margin-bottom:.25rem;
}
.cbg__item {
  display:flex;
  align-items:center;
  gap:.5rem;
}
.cbg__item.disabled {
  opacity:.6;
  cursor:not-allowed;
}
</style>
