<template>
  <label class="cb" :class="{ 'cb--disabled': disabled }">
    <BaseCheckbox v-model="checked" :disabled="disabled" :name="name" />
    <span class="cb__text"><slot>{{ label }}</slot></span>
  </label>
</template>

<script setup>
import { computed } from 'vue'
import BaseCheckbox from '../BaseCheckbox.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'change'])
const checked = computed({
  get: () => props.modelValue,
  set: v => { emit('update:modelValue', v); emit('change', v) }
})
</script>

<style scoped>
.cb{display:inline-flex;align-items:center;gap:.5rem;user-select:none;cursor:pointer}
.cb--disabled{opacity:.6;cursor:not-allowed}
.cb__text{color:#111827}
</style>
