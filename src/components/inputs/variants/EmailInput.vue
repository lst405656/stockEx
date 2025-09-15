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

/**
 * @component EmailInput
 * @description
 * 이메일 전용 입력 필드 컴포넌트.  
 * - `BaseInput` 기반  
 * - 소문자 변환, trim, 기본 이메일 형식 검증 지원  
 * - `validator` prop으로 비동기/커스텀 검증 가능  
 * - `input` 시점 혹은 `blur` 시점에 검증 실행 가능
 *
 * @example
 * <EmailInput v-model="email" @valid="onValid" @invalid="onInvalid" />
 */

/**
 * @typedef {Object} EmailInputProps
 * @property {string} [modelValue=''] - 입력된 이메일 값 (v-model)
 * @property {boolean} [required=false] - 필수 여부
 * @property {string} [placeholder='you@example.com'] - placeholder
 * @property {string} [autocomplete='email'] - 브라우저 자동완성 옵션
 * @property {boolean} [disabled=false] - 비활성화 여부
 * @property {boolean} [readonly=false] - 읽기 전용 여부
 * @property {string} [name=''] - input name
 * @property {boolean} [normalizeLowercase=true] - 입력 값을 자동으로 소문자 변환
 * @property {boolean} [trim=true] - 앞뒤 공백 제거
 * @property {'input'|'blur'} [validateOn='blur'] - 검증 실행 시점
 * @property {number} [debounce=250] - validateOn='input'일 때 디바운스(ms)
 * @property {(email:string)=>true|string|Promise<true|string>} [validator] - 커스텀/비동기 검증 함수
 */
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
  validator: { type: Function, default: null }
})

/**
 * @event update:modelValue - 값 변경 시 발생
 * @event valid - 검증 성공 시 발생 (payload: string 값)
 * @event invalid - 검증 실패 시 발생 (payload: string 에러 메시지)
 * @event change - 값 변경 후 blur 시 발생
 */
const emit = defineEmits(['update:modelValue', 'valid', 'invalid'])

/** 내부 값 (양방향 바인딩용) */
const inner = ref(props.modelValue ?? '')
watch(() => props.modelValue, v => { inner.value = v ?? '' })

/** debounce 타이머 */
let timer = null
onBeforeUnmount(() => { if (timer) clearTimeout(timer) })

/**
 * 문자열 정규화
 * - trim 옵션 적용
 * - lowercase 옵션 적용
 * @param {string} v
 * @returns {string}
 */
function norm(v) {
  let n = v ?? ''
  if (props.trim) n = n.trim()
  if (props.normalizeLowercase) n = n.toLowerCase()
  return n
}

/** 단순 이메일 형식 검사 */
const SIMPLE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * 실제 검증 수행
 * @param {string} v
 * @returns {Promise<string>} 에러 메시지 (없으면 '')
 */
async function runValidation(v) {
  if (props.required && !v) return '이메일을 입력해주세요.'
  if (v && !SIMPLE_EMAIL.test(v)) return '이메일 형식이 올바르지 않습니다.'
  if (props.validator) {
    const res = await props.validator(v)
    if (res !== true) return typeof res === 'string' ? res : '이메일을 확인해주세요.'
  }
  return ''
}

/**
 * 즉시 검증 실행 후 이벤트 발생
 * @param {string} v
 */
async function validateNow(v) {
  const msg = await runValidation(v)
  if (msg) emit('invalid', msg)
  else emit('valid', v)
}

/**
 * input 이벤트 핸들러
 * - 값 정규화 후 update:modelValue emit
 * - validateOn='input'이면 디바운스 검증 실행
 */
function onInput() {
  const n = norm(inner.value)
  emit('update:modelValue', n)
  if (props.validateOn === 'input') {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => validateNow(n), props.debounce)
  }
}

/**
 * blur 이벤트 핸들러
 * - validateOn='blur'일 때 검증 실행
 */
function onBlur() {
  if (props.validateOn === 'blur') validateNow(norm(inner.value))
}
</script>
