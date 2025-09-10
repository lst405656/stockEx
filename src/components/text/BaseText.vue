<template>
  <component
    :is="as"
    class="txt"
    :class="[
      `txt--variant-${variant}`,
      `txt--size-${size}`,
      `txt--weight-${weight}`,
      `txt--align-${align}`,
      underline && 'txt--underline'
    ]"
    :style="styleObj"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  as: { type: String, default: 'span' },          // 'span' | 'p' | 'h1'~'h6' 등
  variant: { type: String, default: 'body' },      // 'body' | 'muted' | 'caption' | 'overline' | 'link'
  size: { type: String, default: 'md' },           // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  weight: { type: String, default: 'normal' },     // 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  align: { type: String, default: 'start' },       // 'start' | 'center' | 'end' | 'justify'
  underline: { type: Boolean, default: false },    // 필요 시 밑줄
  color: { type: String, default: '' },            // 임시 색상 오버라이드
  truncate: { type: [Boolean, Number], default: false } // true: 한 줄, 숫자: N줄 말줄임
})

const styleObj = computed(() => {
  const s = {}
  if (props.color) s.color = props.color
  if (props.truncate === true) {
    Object.assign(s, { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
  } else if (typeof props.truncate === 'number' && props.truncate > 1) {
    Object.assign(s, {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: String(props.truncate),
      overflow: 'hidden'
    })
  }
  return s
})
</script>

<style scoped>
/* 기본 색/톤 */
.txt--variant-body     { color:#111827; }
.txt--variant-muted    { color:#6b7280; }
.txt--variant-caption  { color:#6b7280; text-transform:none; font-size:.875rem; }
.txt--variant-overline { color:#6b7280; text-transform:uppercase; letter-spacing:.06em; font-size:.75rem; }
.txt--variant-link     { color:#2563eb; text-decoration:underline; cursor:pointer; }

/* 크기 */
.txt--size-xs{ font-size:.75rem; line-height:1.1; }
.txt--size-sm{ font-size:.875rem; line-height:1.25; }
.txt--size-md{ font-size:1rem; line-height:1.4; }
.txt--size-lg{ font-size:1.125rem; line-height:1.5; }
.txt--size-xl{ font-size:1.25rem; line-height:1.6; }

/* 두께 */
.txt--weight-light{ font-weight:300; }
.txt--weight-normal{ font-weight:400; }
.txt--weight-medium{ font-weight:500; }
.txt--weight-semibold{ font-weight:600; }
.txt--weight-bold{ font-weight:700; }

/* 정렬 */
.txt--align-start{ text-align:left; }
.txt--align-center{ text-align:center; }
.txt--align-end{ text-align:right; }
.txt--align-justify{ text-align:justify; }

.txt--underline{ text-decoration: underline; }
</style>
