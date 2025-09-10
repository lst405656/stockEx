<template>
  <component
    :is="tag"
    :class="classes"
    :disabled="isNativeDisabled"
    :aria-disabled="disabled || loading ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    v-bind="passThroughAttrs"
    @click="onClick"
  >
    <slot name="iconLeft" />
    <span v-if="$slots.default"><slot /></span>
    <slot name="iconRight" />
    <span v-if="loading" class="spinner" aria-hidden="true"></span>
  </component>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary|secondary|danger|ghost…
  size: { type: String, default: 'md' },         // sm|md|lg
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  as: { type: String, default: 'button' },       // 'button' | 'a' | 'router-link'
  to: { type: [String, Object], default: null }, // router-link 용
  href: { type: String, default: null },         // a 태그 용
  type: { type: String, default: 'button' }      // submit/reset/button
})

const emit = defineEmits(['click'])

const tag = computed(() => {
  if (props.as === 'router-link') return 'RouterLink'
  if (props.as === 'a') return 'a'
  return 'button'
})

const isNativeDisabled = computed(() => props.as === 'button' ? (props.disabled || props.loading) : undefined)

const classes = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`,
  props.loading && 'is-loading',
  props.disabled && 'is-disabled'
].filter(Boolean).join(' '))

const attrs = useAttrs()
// href/to 전달
const passThroughAttrs = computed(() => {
  const base = { ...attrs }
  if (props.as === 'a' && props.href) base.href = props.href
  if (props.as === 'router-link' && props.to) base.to = props.to
  if (props.as === 'button') base.type = props.type
  return base
})

function onClick(e) {
  if (props.disabled || props.loading) {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  emit('click', e)
}
</script>

<style scoped>
.btn { display:inline-flex; align-items:center; gap:.5rem; padding:.5rem .9rem; border-radius:.5rem; border:1px solid transparent; cursor:pointer; }
.btn--primary { background:#1f6feb; color:white; }
.btn--secondary { background:white; color:#1f2328; border-color:#d0d7de; }
.btn--danger { background:#d1242f; color:white; }
.btn--ghost { background:transparent; color:#1f2328; }
.btn--sm { padding:.35rem .65rem; font-size:.875rem; }
.btn--md { font-size:1rem; }
.btn--lg { padding:.65rem 1.1rem; font-size:1.125rem; }
.is-disabled { opacity:.6; cursor:not-allowed; }
.spinner { width:1em; height:1em; border:.15em solid currentColor; border-right-color:transparent; border-radius:50%; animation:spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
