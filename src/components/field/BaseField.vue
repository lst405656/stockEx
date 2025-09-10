<template>
  <div class="fld" :class="[{ 'fld--invalid': !!error, 'fld--block': block }, `fld--${size}`]">
    <!-- Label -->
    <label v-if="label" :for="controlId" class="fld__label">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="fld__req">*</span>
      <slot name="label-extra" />
    </label>

    <!-- Control 영역: 기본 슬롯에 controlProps를 내려줌 -->
    <div class="fld__control">
      <slot name="prefix" />
      <!-- 사용처에서 v-bind="controlProps" 로 바인딩 -->
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

const props = defineProps({
  id: String,
  label: String,
  help: String,
  error: String,
  required: Boolean,
  block: { type: Boolean, default: true },
  size: { type: String, default: 'md' } // sm | md | lg
})

const uid = Math.random().toString(36).slice(2, 9)
const controlId = computed(() => props.id || `fld-${uid}`)
const helpId = `help-${uid}`
const errorId = `err-${uid}`

const describedBy = computed(() => {
  const ids = []
  if (props.help) ids.push(helpId)
  if (props.error) ids.push(errorId)
  return ids.length ? ids.join(' ') : undefined
})

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

/* 간단한 size 훅(컨트롤 자체 스타일은 각 Base에 있음) */
.fld--sm .fld__label { font-size: .8125rem; }
.fld--lg .fld__label { font-size: .9375rem; }
</style>
