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

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // 오직 불리언
  disabled: { type: Boolean, default: false },
  name: { type: String, default: '' },
  id: { type: String, default: () => `chk-${Math.random().toString(36).slice(2,9)}` },
  /** 시각적 3상 표시 (값 자체는 바꾸지 않음) */
  indeterminate: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])

const el = ref(null)
function syncIndeterminate() { if (el.value) el.value.indeterminate = !!props.indeterminate }
onMounted(syncIndeterminate)
watch(() => props.indeterminate, syncIndeterminate)

// 외부 제어용
function focus() { el.value?.focus?.() }
function blur()  { el.value?.blur?.() }
defineExpose({ focus, blur })
</script>

<style scoped>
.base-checkbox{ width:16px; height:16px; vertical-align:middle; accent-color:#2563eb }
.base-checkbox:disabled{ opacity:.6; cursor:not-allowed }
</style>
