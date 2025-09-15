<template>
  <input
    ref="el"
    type="checkbox"
    class="base-checkbox"
    :id="id"
    :name="name"
    :disabled="disabled"
    :checked="!!modelValue"
    @change="$emit('update:modelValue', $event.target.checked)"
  />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

/**
 * @component BaseCheckbox
 * @description
 * 기본 체크박스 컴포넌트  
 * - `v-model`을 통해 불리언 값 바인딩  
 * - `indeterminate` prop으로 시각적 3상 표시 가능(값 자체는 변경되지 않음)  
 * - `focus()`, `blur()` 메서드 외부 노출  
 * - 접근성: id/name 지정 가능
 *
 * @example
 * <!-- 기본 사용 -->
 * <BaseCheckbox v-model="checked" />
 *
 * <!-- 비활성화 -->
 * <BaseCheckbox v-model="checked" disabled />
 *
 * <!-- 3상 상태 -->
 * <BaseCheckbox v-model="checked" :indeterminate="true" />
 *
 * <!-- ref를 통한 focus 제어 -->
 * <BaseCheckbox ref="chk" v-model="checked" />
 * // setup() 내
 * const chk = ref(null)
 * chk.value?.focus()
 */

/**
 * @typedef {Object} BaseCheckboxProps
 * @property {boolean} [modelValue=false] - 체크 여부 (v-model)
 * @property {boolean} [disabled=false] - 비활성화 여부
 * @property {string} [name=''] - 네이티브 name 속성
 * @property {string} [id] - input id (기본: 자동 생성)
 * @property {boolean} [indeterminate=false] - 시각적 3상 상태 (값은 변하지 않음)
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false }, // 오직 불리언
  disabled: { type: Boolean, default: false },
  name: { type: String, default: '' },
  id: { type: String, default: () => `chk-${Math.random().toString(36).slice(2,9)}` },
  /** 시각적 3상 표시 (값 자체는 바꾸지 않음) */
  indeterminate: { type: Boolean, default: false }
})

/** @event update:modelValue - 체크 상태가 변경될 때 발생 */
defineEmits(['update:modelValue'])

/** 내부 input 요소 참조 */
const el = ref(null)

/**
 * indeterminate 속성 동기화
 * - prop이 true면 체크박스가 "부분 선택" 상태로 보임
 */
function syncIndeterminate() { if (el.value) el.value.indeterminate = !!props.indeterminate }
onMounted(syncIndeterminate)
watch(() => props.indeterminate, syncIndeterminate)

/**
 * 외부 제어용 메서드
 * @method focus - 체크박스에 포커스
 * @method blur  - 체크박스 포커스 해제
 */
function focus() { el.value?.focus?.() }
function blur()  { el.value?.blur?.() }
defineExpose({ focus, blur })
</script>

<style scoped>
.base-checkbox{ width:16px; height:16px; vertical-align:middle; accent-color:#2563eb }
.base-checkbox:disabled{ opacity:.6; cursor:not-allowed }
</style>
