<template>
  <div class="cbg" role="group" :aria-labelledby="label ? labelId : undefined">
    <div v-if="label" :id="labelId" class="cbg__label">{{ label }}</div>

    <!-- 전체 선택(옵션)도 BaseCheckbox를 사용 -->
    <label v-if="selectAll" class="cbg__item" :class="{ disabled }">
      <BaseCheckbox
        v-model="allChecked"
        :indeterminate="indeterminate"
        :disabled="disabled"
        @update:modelValue="toggleAll"
      />
      <span>{{ selectAllLabel }}</span>
    </label>

    <!-- 옵션 목록: 각 항목도 BaseCheckbox를 사용 (불리언 바인딩) -->
    <label
      v-for="opt in options"
      :key="keyOf(opt)"
      class="cbg__item"
      :class="{ disabled: disabled || !!opt.disabled }"
    >
      <BaseCheckbox
        :modelValue="isChecked(opt.value)"
        :disabled="disabled || !!opt.disabled"
        @update:modelValue="(v) => toggleItem(opt.value, v)"
      />
      <span>{{ opt.label }}</span>
    </label>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import BaseCheckbox from '../BaseCheckbox.vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] }, // 선택된 값 배열
  options: { type: Array, default: () => [] },    // { label, value, disabled? }[]
  disabled: { type: Boolean, default: false },
  label: { type: String, default: '' },
  name: { type: String, default: '' },

  selectAll: { type: Boolean, default: false },
  selectAllLabel: { type: String, default: '전체 선택' }
})
const emit = defineEmits(['update:modelValue', 'change'])

const labelId = `cbg-${Math.random().toString(36).slice(2,9)}`
const set = computed(() => new Set(props.modelValue))
const enabledValues = computed(() => props.options.filter(o => !o.disabled).map(o => o.value))

const allChecked = computed({
  get() {
    if (enabledValues.value.length === 0) return false
    return enabledValues.value.every(v => set.value.has(v))
  },
  set(v) { /* no-op: 토글은 toggleAll에서 처리 */ }
})
const indeterminate = computed(() => {
  const cnt = enabledValues.value.filter(v => set.value.has(v)).length
  return cnt > 0 && cnt < enabledValues.value.length
})

function keyOf(opt) { return opt.value ?? opt.label }
function isChecked(value) { return set.value.has(value) }

function nextArray(updatedSet) { return Array.from(updatedSet) }

function toggleItem(value, checked) {
  const next = new Set(set.value)
  if (checked) next.add(value)
  else next.delete(value)
  const arr = nextArray(next)
  emit('update:modelValue', arr)
  emit('change', arr)
}

function toggleAll(checked) {
  const arr = checked ? enabledValues.value.slice() : []
  emit('update:modelValue', arr)
  emit('change', arr)
}
</script>

<style scoped>
.cbg{display:flex;flex-direction:column;gap:.5rem}
.cbg__label{font-weight:600;margin-bottom:.25rem}
.cbg__item{display:flex;align-items:center;gap:.5rem}
.cbg__item.disabled{opacity:.6;cursor:not-allowed}
</style>
