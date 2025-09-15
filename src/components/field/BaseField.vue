<template>
  <div class="fld" :class="[{ 'fld--invalid': !!error, 'fld--block': block }, `fld--${size}`]">
    <!-- Label -->
    <label v-if="label" :for="controlId" class="fld__label">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="fld__req">*</span>
      <slot name="label-extra" />
    </label>

    <!-- Control 영역 -->
    <div class="fld__control">
      <slot name="prefix" />
      <!-- 기본 슬롯에 controlProps를 전달 -->
      <slot :controlProps="controlProps" />
      <slot name="suffix" />
    </div>

    <!-- Meta -->
    <div class="fld__meta">
      <p v-if="help" :id="helpId" class="fld__help">{{ help }}</p>
      <p v-if="error" :id="errorId" class="fld__error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * @component FormField
 * @description
 * 라벨, 도움말, 에러 메시지, prefix/suffix 슬롯을 지원하는 폼 필드 래퍼 컴포넌트  
 * - 기본 슬롯에는 `controlProps`가 내려옴 (id, aria-* 등 접근성 속성)  
 * - 실제 입력 컴포넌트(BaseInput, BaseSelect 등)는 `v-bind="controlProps"`로 받아 사용  
 * - `error`가 있으면 aria-invalid 및 스타일 반영  
 * - size/bock 옵션으로 스타일 조정 가능
 *
 * @example
 * <!-- BaseInput과 함께 사용 -->
 * <FormField label="이메일" help="회사 이메일을 입력하세요" :error="emailError" required>
 *   <template #default="{ controlProps }">
 *     <BaseInput v-bind="controlProps" v-model="email" />
 *   </template>
 * </FormField>
 *
 * <!-- prefix/suffix -->
 * <FormField label="검색">
 *   <template #prefix>🔍</template>
 *   <template #default="{ controlProps }">
 *     <BaseInput v-bind="controlProps" v-model="keyword" />
 *   </template>
 *   <template #suffix>.com</template>
 * </FormField>
 */

/**
 * @typedef {Object} FormFieldProps
 * @property {string} [id] - 컨트롤 id (미지정 시 자동 생성)
 * @property {string} [label] - 라벨 텍스트
 * @property {string} [help] - 도움말 텍스트
 * @property {string} [error] - 에러 메시지
 * @property {boolean} [required=false] - 필수 여부 (* 표시 및 aria-required)
 * @property {boolean} [block=true] - 전체 너비 사용 여부
 * @property {'sm'|'md'|'lg'} [size='md'] - 라벨 폰트 크기 프리셋
 */
const props = defineProps({
  id: String,
  label: String,
  help: String,
  error: String,
  required: Boolean,
  block: { type: Boolean, default: true },
  size: { type: String, default: 'md' } // sm | md | lg
})

/** 고유 uid (접근성 id 구성에 사용) */
const uid = Math.random().toString(36).slice(2, 9)

/** 컨트롤 id */
const controlId = computed(() => props.id || `fld-${uid}`)
/** 도움말 id */
const helpId = `help-${uid}`
/** 에러 id */
const errorId = `err-${uid}`

/** aria-describedby 문자열 */
const describedBy = computed(() => {
  const ids = []
  if (props.help) ids.push(helpId)
  if (props.error) ids.push(errorId)
  return ids.length ? ids.join(' ') : undefined
})

/**
 * 기본 슬롯으로 전달되는 접근성 props
 * - id
 * - aria-describedby (help/error 연결)
 * - aria-invalid (error 있을 경우)
 * - required
 */
const controlProps = computed(() => ({
  id: controlId.value,
  'aria-describedby': describedBy.value,
  'aria-invalid': props.error ? 'true' : undefined,
  required: props.required || undefined
}))
</script>

<style scoped>
.fld { display: flex; flex-direction: column; gap: .5rem; }
.fld--block { width: 100%; }
.fld__label { font-size: .875rem; color: #6b7280; }
.fld__req { color: #ef4444; margin-left: .25rem; }
.fld__control { display: flex; align-items: center; gap: .5rem; }
.fld__help { font-size: .75rem; color: #6b7280; }
.fld__error { font-size: .75rem; color: #ef4444; }
.fld--invalid .fld__label { color: #ef4444; }

/* size 프리셋 */
.fld--sm .fld__label { font-size: .8125rem; }
.fld--lg .fld__label { font-size: .9375rem; }
</style>
