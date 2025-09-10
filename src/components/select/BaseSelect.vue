<template>
  <select
    class="base-select"
    :class="[`size-${size}`, { disabled, invalid }]"
    :value="modelValue"
    :disabled="disabled"
    :required="required"
    :name="name"
    @change="onChange"
    v-bind="$attrs"
  >
    <!-- placeholder가 있으면 첫 항목으로 표시 -->
    <option v-if="placeholder" :value="placeholderValue" disabled hidden>
      {{ placeholder }}
    </option>

    <!-- options 배열로 전달 -->
    <option
      v-for="opt in options"
      :key="keyOf(opt)"
      :value="valueOf(opt)"
    >
      {{ labelOf(opt) }}
    </option>

    <!-- 또는 직접 <option> 슬롯 제공 -->
    <slot />
  </select>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number, null], default: '' },

  /** 문자열 배열 또는 {label, value} 배열 모두 허용 */
  options: { type: Array, default: () => [] },

  placeholder: { type: String, default: '' },
  name: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },

  /** sm | md | lg */
  size: { type: String, default: 'md' },
})
const emit = defineEmits(['update:modelValue', 'change'])

const placeholderValue = ''

function onChange(e) {
  const v = e.target.value
  emit('update:modelValue', v)
  emit('change', v)
}

function valueOf(opt) {
  return typeof opt === 'object' ? (opt.value ?? opt.id ?? opt.key ?? '') : opt
}
function labelOf(opt) {
  return typeof opt === 'object' ? (opt.label ?? String(valueOf(opt))) : String(opt)
}
function keyOf(opt) {
  const v = valueOf(opt)
  return typeof v === 'object' ? JSON.stringify(v) : String(v)
}
</script>

<style scoped>
.base-select{
  width:100%;
  border:1px solid #cfd4dc;
  border-radius:12px;
  background:#fff;
  color:#111827;
  line-height:1.2;
  padding:0 12px;
  outline: none;
}
.base-select.size-sm{ height:32px; font-size:14px; }
.base-select.size-md{ height:38px; font-size:15px; }
.base-select.size-lg{ height:44px; font-size:16px; }

.base-select:focus{ box-shadow:0 0 0 3px rgba(59,130,246,.25); border-color:#93c5fd; }
.base-select.disabled{ background:#f3f4f6; color:#9ca3af; cursor:not-allowed; }
.base-select.invalid{ border-color:#ef4444; }
</style>
