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

/**
 * @component PasswordInput
 * @description
 * 비밀번호 입력 필드 컴포넌트  
 * - 표시/숨김 토글 버튼 제공(접근성: aria-label 포함)  
 * - CapsLock 감지 이벤트(`capslock`) 지원  
 * - `BaseInput` 기반으로 표준 input 속성/이벤트 사용 가능
 *
 * @example
 * <!-- 기본 사용 -->
 * <PasswordInput v-model="pw" />
 *
 * <!-- 자동완성/초기 표시 상태 -->
 * <PasswordInput v-model="pw" autocomplete="new-password" :reveal-by-default="true" />
 *
 * <!-- CapsLock 경고 -->
 * <PasswordInput
 *   v-model="pw"
 *   @capslock="onCaps($event)"
 *   @enter="submit()"
 * />
 */

/**
 * @typedef {Object} PasswordInputProps
 * @property {string} [modelValue=''] - 입력된 비밀번호 (v-model)
 * @property {string} [placeholder='비밀번호'] - placeholder 텍스트
 * @property {boolean} [disabled=false] - 비활성화 여부
 * @property {boolean} [readonly=false] - 읽기 전용 여부
 * @property {boolean} [required=false] - 필수 여부
 * @property {string} [name=''] - input name
 * @property {string} [autocomplete='current-password'] - 브라우저 자동완성 힌트
 * @property {boolean} [revealByDefault=false] - 초기 상태에서 비밀번호를 표시할지 여부
 */
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

/**
 * @event update:modelValue - 값 변경 시 발생 (v-model)
 * @event enter - Enter 키를 눌렀을 때 발생
 * @event change - 값 변경 후 blur 시 발생 (BaseInput 위임)
 * @event capslock - CapsLock 상태 변경 시 발생 (payload: boolean)
 */
const emit = defineEmits(['update:modelValue', 'enter', 'capslock'])

/** 내부 v-model 상태 */
const inner = ref(props.modelValue ?? '')
watch(() => props.modelValue, v => (inner.value = v ?? ''))
watch(inner, v => emit('update:modelValue', v))

/** 표시/숨김 상태 */
const revealed = ref(!!props.revealByDefault)

/** 내부 BaseInput ref (포커스 유지용) */
const base = ref(null)

/**
 * 비밀번호 표시/숨김 토글
 * - 토글 후 입력 포커스 유지
 */
function toggle() {
  revealed.value = !revealed.value
  base.value?.focus?.()
}

/**
 * 키다운 핸들러
 * - CapsLock 활성화 여부 감지 후 capslock 이벤트 전파
 * @param {KeyboardEvent} e
 */
function onKeydown(e) {
  if (e.getModifierState && e.getModifierState('CapsLock')) {
    emit('capslock', true)
  } else {
    emit('capslock', false)
  }
}
</script>

<style scoped>
.pw-wrap{
  position: relative;
  display: flex;
  align-items: center;
}
.pw-toggle{
  position: absolute;
  right: .5rem;
  background: transparent;
  border: 0;
  padding: .25rem .4rem;
  font-size: .875rem;
  cursor: pointer;
  color: #2563eb;
}
.pw-toggle:disabled{
  color:#9ca3af;
  cursor:not-allowed;
}
</style>
