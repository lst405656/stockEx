<template>
  <div class="pw-wrap">
    <BaseInput
      ref="base"
      v-model="inner"
      :type="revealed ? 'text' : 'password'"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :name="name"
      :autocomplete="autocomplete"
      @keydown="onKeydown"
      @enter="$emit('enter')"
      @change="$emit('change', $event)"
    />
    <button
      type="button"
      class="pw-toggle"
      :aria-label="revealed ? '비밀번호 숨기기' : '비밀번호 표시'"
      @click="toggle"
      :disabled="disabled || readonly"
    >
      {{ revealed ? '숨김' : '표시' }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseInput from '../BaseInput.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '비밀번호' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  name: { type: String, default: '' },
  autocomplete: { type: String, default: 'current-password' },
  revealByDefault: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'enter', 'capslock'])

const inner = ref(props.modelValue ?? '')
watch(() => props.modelValue, v => (inner.value = v ?? ''))
watch(inner, v => emit('update:modelValue', v))

const revealed = ref(!!props.revealByDefault)
const base = ref(null)
function toggle() {
  revealed.value = !revealed.value
  // 토글 후 포커스 유지
  base.value?.focus?.()
}
function onKeydown(e) {
  if (e.getModifierState && e.getModifierState('CapsLock')) {
    emit('capslock', true)
  } else {
    emit('capslock', false)
  }
}
</script>

<style scoped>
.pw-wrap{ position: relative; display: flex; align-items: center; }
.pw-toggle{
  position: absolute; right: .5rem;
  background: transparent; border: 0; padding: .25rem .4rem;
  font-size: .875rem; cursor: pointer; color: #2563eb;
}
.pw-toggle:disabled{ color:#9ca3af; cursor:not-allowed; }
</style>
