<template>
  <component
    :is="isRouter ? 'RouterLink' : 'a'"
    class="link-reset"
    :class="{ 'is-disabled': disabled }"
    :to="isRouter ? to : undefined"
    :href="!isRouter ? href : undefined"
    :target="!isRouter ? target : undefined"
    :rel="finalRel"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="disabled ? -1 : undefined"
    @click="onClick"
  >
    <!-- 텍스트 스타일은 전부 Text 컴포넌트가 책임 -->
    <Text
      :as="textAs"
      :variant="variant"
      :size="size"
      :weight="weight"
      :align="align"
      :underline="underline"
      :color="color || undefined"
    >
      <slot />
    </Text>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import Text from '../BaseText.vue'

const props = defineProps({
  // 네비게이션
  to: { type: [String, Object], default: null },   // 내부 라우팅
  href: { type: String, default: null },           // 외부 링크
  target: { type: String, default: null },
  rel: { type: String, default: null },
  disabled: { type: Boolean, default: false },

  // 텍스트(타이포) 속성 - Text로 그대로 전달
  textAs:   { type: String, default: 'span' },     // 문장 내 인라인 기본
  variant:  { type: String, default: 'link' },     // 'body' | 'muted' | 'caption' | 'overline' | 'link'
  size:     { type: String, default: 'md' },       // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  weight:   { type: String, default: 'normal' },   // 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  align:    { type: String, default: 'start' },    // 'start' | 'center' | 'end' | 'justify'
  underline:{ type: Boolean, default: true },
  color:    { type: String, default: '' }          // 필요 시 색 오버라이드
})

const isRouter = computed(() => !!props.to && !props.href)
const finalRel = computed(() => {
  if (props.rel) return props.rel
  if (!isRouter.value && props.target === '_blank') return 'noopener noreferrer'
  return undefined
})

function onClick(e) {
  if (props.disabled) {
    e.preventDefault()
    e.stopPropagation()
  }
}
</script>

<style scoped>
/* 앵커 기본 스타일 초기화: 시각은 Text가 담당 */
.link-reset {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.link-reset:focus-visible {
  outline: 2px solid rgba(37,99,235,.5);
  outline-offset: 2px;
}
.link-reset.is-disabled {
  pointer-events: none;
  cursor: not-allowed;
}
</style>
