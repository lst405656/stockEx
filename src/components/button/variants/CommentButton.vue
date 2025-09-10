<!-- CommentButton.vue -->
<template>
  <BaseButton
    class="rb v-neutral"
    type="button"
    variant="ghost"
    size="sm"
    :loading="loading"
    :disabled="disabled || loading"
    :aria-label="ariaLabel || label || '댓글'"
    @click="$emit('click')"
  >
    <!-- 아이콘 슬롯: 없으면 기본 말풍선 아이콘 사용 -->
    <slot name="icon">
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <path d="M3 3h14v10H8l-5 4V3z" fill="currentColor"/>
      </svg>
    </slot>

    <span v-if="label" class="label">{{ label }}</span>
    <span v-if="showCount" class="count">{{ count }}</span>
  </BaseButton>
</template>

<script setup>
import BaseButton from '../BaseButton.vue'

defineProps({
  count: { type: Number, default: 0 },
  label: { type: String, default: '댓글' },
  ariaLabel: { type: String, default: '' },
  showCount: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<style scoped>
/* BaseButton 위에 얹는 톤 다운 스타일 (Reaction 계열 공통 토큰) */
.rb{
  --btn-bg: transparent;
  --btn-border: transparent;
  --btn-fg: #6b7280;
  padding: 6px 8px;
  gap: 6px;
  border-radius: 8px;
}

.rb:hover{ background:#f3f4f6; }
.rb:where(.is-disabled){ opacity:.6; cursor:not-allowed; }

.v-neutral{ color:#6b7280; }
.count{ min-width: 1ch; }
</style>
