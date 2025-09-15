<template>
  <label class="cb" :class="{ 'cb--disabled': disabled }">
    <BaseCheckbox v-model="checked" :disabled="disabled" :name="name" />
    <span class="cb__text"><slot>{{ label }}</slot></span>
  </label>
</template>

<script setup>
import { computed } from 'vue'
import BaseCheckbox from '../BaseCheckbox.vue'

/**
 * @component LabeledCheckbox
 * @description
 * 텍스트 라벨을 포함한 체크박스 컴포넌트  
 * - 내부적으로 `BaseCheckbox` 사용  
 * - `label` prop 또는 `<slot>`으로 라벨 지정  
 * - `v-model`을 통해 불리언 값 바인딩  
 * - `disabled` 상태 지원
 *
 * @example
 * <!-- 기본 사용 -->
 * <LabeledCheckbox v-model="agreed" label="약관에 동의합니다" />
 *
 * <!-- 커스텀 슬롯 라벨 -->
 * <LabeledCheckbox v-model="subscribed">
 *   뉴스레터 구독
 * </LabeledCheckbox>
 *
 * <!-- 비활성화 -->
 * <LabeledCheckbox v-model="checked" label="선택 불가" disabled />
 */

/**
 * @typedef {Object} LabeledCheckboxProps
 * @property {boolean} [modelValue=false] - 체크 여부 (v-model)
 * @property {string} [label=''] - 기본 라벨 텍스트 (slot으로 대체 가능)
 * @property {boolean} [disabled=false] - 비활성화 여부
 * @property {string} [name=''] - 네이티브 name 속성
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: '' }
})

/**
 * @event update:modelValue - 체크 상태가 변경될 때 발생
 * @event change - 체크 상태가 변경될 때 추가로 발생 (별도 핸들링용)
 */
const emit = defineEmits(['update:modelValue', 'change'])

/**
 * v-model 동기화를 위한 computed
 * - set 시 두 이벤트 모두 발생
 */
const checked = computed({
  get: () => props.modelValue,
  set: v => { emit('update:modelValue', v); emit('change', v) }
})
</script>

<style scoped>
.cb {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  user-select: none;
  cursor: pointer;
}
.cb--disabled {
  opacity: .6;
  cursor: not-allowed;
}
.cb__text {
  color: #111827;
}
</style>
