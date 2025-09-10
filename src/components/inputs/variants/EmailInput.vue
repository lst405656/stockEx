<template>
  <BaseInput
    v-model="inner"
    type="email"
    :autocomplete="autocomplete"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :name="name"
    @input="onInput"
    @blur="onBlur"
    @change="$emit('change', $event)"
  />
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import BaseInput from '../BaseInput.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'you@example.com' },
  autocomplete: { type: String, default: 'email' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  name: { type: String, default: '' },
  normalizeLowercase: { type: Boolean, default: true },
  trim: { type: Boolean, default: true },
  validateOn: { type: String, default: 'blur' }, // 'input' | 'blur'
  debounce: { type: Number, default: 250 },
  // (email) => true | string | Promise<true|string>
  validator: { type: Function, default: null }
})
const emit = defineEmits(['update:modelValue', 'valid', 'invalid'])

const inner = ref(props.modelValue ?? '')
watch(() => props.modelValue, v => { inner.value = v ?? '' })

let timer = null
onBeforeUnmount(() => { if (timer) clearTimeout(timer) })

function norm(v) {
  let n = v ?? ''
  if (props.trim) n = n.trim()
  if (props.normalizeLowercase) n = n.toLowerCase()
  return n
}
const SIMPLE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

async function runValidation(v) {
  if (props.required && !v) return '이메일을 입력해주세요.'
  if (v && !SIMPLE_EMAIL.test(v)) return '이메일 형식이 올바르지 않습니다.'
  if (props.validator) {
    const res = await props.validator(v)
    if (res !== true) return typeof res === 'string' ? res : '이메일을 확인해주세요.'
  }
  return ''
}
async function validateNow(v) {
  const msg = await runValidation(v)
  if (msg) emit('invalid', msg); else emit('valid', v)
}

function onInput() {
  const n = norm(inner.value)
  emit('update:modelValue', n)
  if (props.validateOn === 'input') {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => validateNow(n), props.debounce)
  }
}
function onBlur() {
  if (props.validateOn === 'blur') validateNow(norm(inner.value))
}
</script>
