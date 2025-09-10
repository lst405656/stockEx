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
  emitNumber: { type: Boolean, default: true } // true면 Number or null로 emit
})
const emit = defineEmits(['update:modelValue', 'valid', 'invalid'])

const display = ref(valueToString(props.modelValue))
watch(() => props.modelValue, v => (display.value = valueToString(v)))

function valueToString(v) {
  if (v === null || v === undefined) return ''
  return String(v)
}
function sanitize(raw) {
  let s = raw.replace(/[^\d\.\-]/g, '')
  if (!props.allowDecimal) s = s.replace(/\./g, '')
  if (!props.allowNegative) s = s.replace(/-/g, '')
  // 소수점 하나만 허용
  s = s.replace(/(\..*)\./g, '$1')
  // 마이너스는 맨 앞만 허용
  s = s.replace(/(?!^)-/g, '')
  return s
}
function clamp(n) {
  if (n < props.min) return props.min
  if (n > props.max) return props.max
  return n
}
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

function onInput(e) {
  const s = sanitize(e.target.value)
  display.value = s
  // 입력 중에는 즉시 emit (파싱 가능한 경우에 한해)
  if (s === '' || s === '-' || s === '.' || s === '-.') {
    emit('update:modelValue', props.emptyAsNull ? null : '')
  } else if (!Number.isNaN(Number(s))) {
    const n = Number(s)
    if (props.emitNumber) emit('update:modelValue', n)
    else emit('update:modelValue', s)
  }
}
function onBlur() {
  // blur 시 확정: 클램프 및 정규화
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
