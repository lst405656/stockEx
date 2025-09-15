<template>
  <component
    :is="isRouter ? 'RouterLink' : (href ? 'a' : as)"
    class="base-card"
    :class="[
      `v-${variant}`, 
      `p-${pad}`, 
      `r-${radius}`,
      { 'is-clickable': isClickable, 'is-disabled': disabled }
    ]"
    :to="(isRouter && !disabled) ? to : undefined"
    :href="(!isRouter && !disabled) ? href : undefined"
    :target="(!isRouter && !disabled) ? target : undefined"
    :rel="finalRel"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : (isClickable ? 0 : undefined)"
    v-bind="$attrs"
  >
    <!-- 미디어 영역 (예: 아바타, 이미지) -->
    <slot name="media" />

    <!-- 헤더 -->
    <div v-if="$slots.header" class="card__header">
      <slot name="header" />
    </div>

    <!-- 본문 -->
    <div class="card__body">
      <slot />
    </div>

    <!-- 푸터 -->
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  as: { type: String, default: 'div' },             // section|div|article…
  variant: { type: String, default: 'outlined' },   // outlined | elevated | soft | ghost
  pad: { type: String, default: 'md' },             // none | sm | md | lg
  radius: { type: String, default: 'xl' },          // md | lg | xl | full
  clickable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },

  // 링크/라우팅
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  target: { type: String, default: '_self' },
  rel: { type: String, default: '' },
})

const isRouter = computed(() => !!props.to && !props.href)
const isClickable = computed(() => props.clickable || isRouter.value || !!props.href)
const finalRel = computed(() => {
  if (props.rel) return props.rel
  if (!isRouter.value && props.href && props.target === '_blank') {
    return 'noopener noreferrer'
  }
  return undefined
})
</script>

<style scoped>
.base-card {
  --bg: #fff;
  --fg: #111827;
  --bd: #cfd4dc;
  --ring: #3b82f633;
  --shadow: 0 1px 2px rgba(0, 0, 0, .06), 0 1px 1px rgba(0, 0, 0, .04);

  background: var(--bg);
  color: var(--fg);
  border: 1px solid var(--bd);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition:
    box-shadow .15s ease,
    transform .15s ease,
    border-color .15s ease,
    background .15s ease;
}

/* Variants */
.v-elevated { box-shadow: var(--shadow); border-color: transparent; }
.v-soft { background: #f8fafc; border-color: #e5e7eb; }
.v-ghost { background: transparent; border-color: transparent; }

/* Padding */
.p-none { padding: 0; }
.p-sm { padding: 10px; }
.p-md { padding: 16px; }
.p-lg { padding: 24px; }

/* Radius */
.r-md { border-radius: 12px; }
.r-lg { border-radius: 16px; }
.r-xl { border-radius: 18px; }
.r-full { border-radius: 999px; }

/* States */
.base-card.is-clickable { cursor: pointer; }
.base-card.is-clickable:hover { box-shadow: var(--shadow); transform: translateY(-1px); }
.base-card.is-clickable:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--ring), var(--shadow);
}
.base-card.is-clickable:active { transform: translateY(0); }
.base-card.is-disabled { opacity: .6; pointer-events: none; }

/* Slots */
.card__header { margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.card__body { min-width: 0; }
.card__footer { margin-top: 12px; display: flex; align-items: center; gap: 8px; justify-content: space-between; }
</style>
