<!-- LikeButton.vue -->
<template>
  <BaseButton
    class="rb v-success"
    type="button"
    variant="ghost"
    size="sm"
    :loading="loading"
    :disabled="disabled || loading"
    :aria-pressed="String(!!modelValue)"
    :aria-label="ariaLabel || label || '좋아요'"
    @click="onClick"
  >
    <!-- 아이콘 슬롯: 기본은 하트 -->
    <slot name="icon">
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <path
          d="M3.2 10.4 9.2 16.5a1 1 0 0 0 1.6 0l6.0-6.1A4 4 0 0 0 11 5.6l-.55.53-.45-.45A4 4 0 0 0 3.2 10.4z"
          fill="currentColor"
        />
      </svg>
    </slot>

    <span v-if="label" class="label">{{ label }}</span>
    <span v-if="showCount" class="count">{{ displayCount }}</span>
  </BaseButton>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from '../BaseButton.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // v-model:liked
  count: { type: Number, default: 0 },
  optimistic: { type: Boolean, default: true },
  showCount: { type: Boolean, default: true },

  label: { type: String, default: '좋아요' },
  ariaLabel: { type: String, default: '' },

  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'toggle', 'click'])

const displayCount = computed(() => {
  if (!props.optimistic) return props.count
  return props.count + (props.modelValue ? 1 : 0)
})

function onClick() {
  emit('click')
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('toggle', next)
}
</script>

<style scoped>
/* Reaction 버튼 공통 톤 */
.rb {
  --btn-bg: transparent;
  --btn-border: transparent;
  --btn-fg: #6b7280;
  padding: 6px 8px;
  gap: 6px;
  border-radius: 8px;
}

.rb:hover { background: #f3f4f6; }
.rb:where(.is-disabled) { opacity: .6; cursor: not-allowed; }

.v-success.on,
.rb[aria-pressed="true"] { color: #16a34a; }

.count { min-width: 1ch; }
</style>
