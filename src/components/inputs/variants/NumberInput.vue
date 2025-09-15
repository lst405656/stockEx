<template>
  <BaseInput
    :type="'text'"
    v-model="display"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :name="name"
    :autocomplete="'off'"
    inputmode="decimal"
    @input="onInput"
    @blur="onBlur"
    @change="$emit('change', $event)"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseInput from '../BaseInput.vue'

/**
 * @component NumberInput
 * @description
 * 숫자 전용 입력 컴포넌트.  
 * - 입력 시 숫자 이외 문자를 제거 (sanitize)  
 * - 소수점/음수 허용 여부 설정 가능  
 * - blur 시점에 min/max 범위 클램핑 및 정규화  
 * - 잘못된 값 입력 시 `invalid` 이벤트 발생  
 * - 정상 입력 시 `valid` 이벤트 발생  
 *
 * @example
 * <NumberInput v-model="price" :min="0" :max="100" @valid="ok" @invalid="err" />
 */

/**
 * @typedef {Object} NumberInputProps
 * @property {number|string|null} [modelValue=''] - 입력 값 (v-model)
 * @property {string} [placeholder=''] - placeholder
 * @property {boolean} [disabled=false] - 비활성화 여부
 * @property {boolean} [readonly=false] - 읽기 전용 여부
 * @property {boolean} [required=false] - 필수 여부
 * @property {string} [name=''] - input name
 *
 * @property {boolean} [allowNegative=true] - 음수 허용 여부
 * @property {boolean} [allowDecimal=true] - 소수점 허용 여부
 * @property {number} [min=-Infinity] - 허용 최소값
 * @property {number} [max=Infinity] - 허용 최대값
 * @property {number} [step=1] - 증가 단위 (현재는 UI 미사용, 참고용)
 *
 * @property {boolean} [emptyAsNull=true] - 빈 값일 때 null로 emit 여부
 * @property {boolean} [emitNumber=true] - true면 Number/null로 emit, false면 String로 emit
 */
const props = defineProps({
  modelValue: { type: [Number, String, null], default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  name: { type: String, default: '' },

  allowNegative: { type: Boolean, default: true },
  allowDecimal: { type: Boolean, default: true },
  min: { type: Number, default: Number.NEGATIVE_INFINITY },
  max: { type: Number, default: Number.POSITIVE_INFINITY },
  step: { type: Number, default: 1 },

  emptyAsNull: { type: Boolean, default: true },
  emitNumber: { type: Boolean, default: true }
})

/**
 * @event update:modelValue - 값이 변경될 때 발생
 * @event valid - 유효한 값일 때 발생 (payload: number 값)
 * @event invalid - 잘못된 값일 때 발생 (payload: string 에러 메시지)
 * @event change - blur 후 값이 확정될 때 발생
 */
const emit = defineEmits(['update:modelValue', 'valid', 'invalid'])

/** 표시용 문자열 상태 (내부 input에 바인딩) */
const display = ref(valueToString(props.modelValue))
watch(() => props.modelValue, v => (display.value = valueToString(v)))

/** modelValue → 문자열 */
function valueToString(v) {
  if (v === null || v === undefined) return ''
  return String(v)
}

/**
 * 입력 문자열 정규화
 * - 숫자/소수점/마이너스만 허용
 * - 소수점 1회만 허용
 * - 마이너스는 맨 앞만 허용
 */
function sanitize(raw) {
  let s = raw.replace(/[^\d\.\-]/g, '')
  if (!props.allowDecimal) s = s.replace(/\./g, '')
  if (!props.allowNegative) s = s.replace(/-/g, '')
  s = s.replace(/(\..*)\./g, '$1')
  s = s.replace(/(?!^)-/g, '')
  return s
}

/** 범위 제한 */
function clamp(n) {
  if (n < props.min) return props.min
  if (n > props.max) return props.max
  return n
}

/**
 * 문자열 → 값으로 변환 후 emit
 * - 공백/미완성 기호('-','.') → null/'' 처리
 * - 숫자 아닌 경우 → invalid emit
 * - 범위 클램프 후 valid emit
 */
function emitValueFromString(s) {
  if (s === '' || s === '-' || s === '.' || s === '-.') {
    emit('update:modelValue', props.emptyAsNull ? null : '')
    return
  }
  const n = Number(s)
  if (Number.isNaN(n)) {
    emit('invalid', '숫자를 입력해주세요.')
    return
  }
  const clamped = clamp(n)
  if (props.emitNumber) emit('update:modelValue', clamped)
  else emit('update:modelValue', String(clamped))
  emit('valid', clamped)
}

/**
 * input 이벤트
 * - sanitize 후 display 업데이트
 * - 입력 중에도 파싱 가능하면 update:modelValue emit
 */
function onInput(e) {
  const s = sanitize(e.target.value)
  display.value = s
  if (s === '' || s === '-' || s === '.' || s === '-.') {
    emit('update:modelValue', props.emptyAsNull ? null : '')
  } else if (!Number.isNaN(Number(s))) {
    const n = Number(s)
    if (props.emitNumber) emit('update:modelValue', n)
    else emit('update:modelValue', s)
  }
}

/**
 * blur 이벤트
 * - 입력값 확정
 * - 범위 클램프 후 정규화
 * - invalid/valid 이벤트 발생
 */
function onBlur() {
  if (display.value === '') {
    emit('update:modelValue', props.emptyAsNull ? null : '')
    return
  }
  if (display.value === '-' || display.value === '.' || display.value === '-.') {
    display.value = ''
    emit('update:modelValue', props.emptyAsNull ? null : '')
    return
  }
  const n = Number(display.value)
  if (Number.isNaN(n)) {
    emit('invalid', '숫자를 입력해주세요.')
    return
  }
  const clamped = clamp(n)
  display.value = String(clamped)
  emit('update:modelValue', props.emitNumber ? clamped : String(clamped))
  emit('valid', clamped)
}
</script>
