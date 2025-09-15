<template>
  <input
    ref="el"
    :id="id"
    class="base-input"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :maxlength="maxlength"
    :name="name"
    :autocomplete="autocomplete"
    @input="$emit('update:modelValue', $event.target.value)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @keydown.enter="$emit('enter')"
    @change="$emit('change', $event)"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

/**
 * @component BaseInput
 * @description
 * 기본 텍스트 입력 필드 컴포넌트  
 * - `v-model`로 문자열/숫자 값 바인딩  
 * - 다양한 type 지원(text, email, password 등)  
 * - disabled, readonly, required, maxlength 등 표준 속성 지원  
 * - focus/blur/select 메서드 외부 노출  
 * - autoFocus 옵션으로 마운트 시 자동 포커스 가능
 *
 * @example
 * <!-- 기본 사용 -->
 * <BaseInput v-model="email" placeholder="이메일 입력" type="email" />
 *
 * <!-- 자동 포커스 -->
 * <BaseInput v-model="name" auto-focus />
 *
 * <!-- 외부 제어 -->
 * <BaseInput ref="inp" v-model="keyword" placeholder="검색어 입력" />
 * <button @click="inp.focus()">포커스</button>
 */

/**
 * @typedef {Object} BaseInputProps
 * @property {string|number} [modelValue=''] - 입력 값 (v-model)
 * @property {string} [type='text'] - input type (text, email, password 등)
 * @property {string} [placeholder=''] - placeholder 텍스트
 * @property {boolean} [disabled=false] - 비활성화 여부
 * @property {boolean} [readonly=false] - 읽기 전용 여부
 * @property {boolean} [required=false] - 필수 여부
 * @property {number|string} [maxlength] - 최대 입력 길이
 * @property {string} [name=''] - name 속성
 * @property {string} [autocomplete=''] - autocomplete 속성
 * @property {string} [id] - input id (기본: 자동 생성)
 * @property {boolean} [autoFocus=false] - 마운트 시 자동 포커스 여부
 */
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type:       { type: String, default: 'text' },
  placeholder:{ type: String, default: '' },
  disabled:   { type: Boolean, default: false },
  readonly:   { type: Boolean, default: false },
  required:   { type: Boolean, default: false },
  maxlength:  { type: [Number, String], default: undefined },
  name:       { type: String, default: '' },
  autocomplete:{type: String, default: ''},
  id:         { type: String, default: () => `inp-${Math.random().toString(36).slice(2,9)}` },
  autoFocus:  { type: Boolean, default: false }
})

/**
 * @event update:modelValue - 값 변경 시 발생
 * @event focus - focus 되었을 때 발생
 * @event blur - blur 되었을 때 발생
 * @event enter - Enter 키를 눌렀을 때 발생
 * @event change - 값 변경 후 focus-out 시 발생
 */
defineEmits(['update:modelValue', 'focus', 'blur', 'enter', 'change'])

/** 내부 input 요소 참조 */
const el = ref(null)

/**
 * 외부 제어 메서드
 * @method focus - input에 포커스
 * @method blur - input blur 처리
 * @method select - input 텍스트 전체 선택
 */
function focus() { el.value?.focus?.() }
function blur()  { el.value?.blur?.() }
function select(){ el.value?.select?.() }
defineExpose({ focus, blur, select })

onMounted(() => {
  if (props.autoFocus) focus()
})
</script>

<style scoped>
.base-input {
  width: 100%;
  padding: .5rem .75rem;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #111827;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: .5rem;
  outline: none;
  transition: box-shadow .15s ease, border-color .15s ease;
}
.base-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, .15);
}
.base-input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}
</style>
