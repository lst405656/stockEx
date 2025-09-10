<template>
  <input
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

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type:       { type: String, default: 'text' }, // 'text' | 'email' | 'password' | ...
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

defineEmits(['update:modelValue', 'focus', 'blur', 'enter'])

// 외부에서 제어할 수 있는 메서드
const el = ref(null)
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
