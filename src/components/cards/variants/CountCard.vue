<!-- src/components/cards/CountCard.vue -->
<template>
  <BaseCard
    class="count-card"
    variant="outlined"
    :pad="pad"
    :radius="radius"
    :clickable="!!to || !!href"
    :to="to"
    :href="href"
    :target="target"
  >
    <div class="value">
      <slot name="value">{{ formatted }}</slot>
    </div>
    <div class="label">
      <slot>{{ label }}</slot>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '../BaseCard.vue'

const props = defineProps({
  value: { type: [Number, String], default: 0 },
  label: { type: String, default: '' },
  decimals: { type: Number, default: 0 },
  locale: { type: String, default: 'ko-KR' },

  // 링크 옵션(선택)
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  target: { type: String, default: '_self' },

  // 카드 패딩/라운드 커스터마이즈(선택)
  pad: { type: String, default: 'lg' },
  radius: { type: String, default: 'xl' },
})

const formatted = computed(() => {
  const n = Number(props.value)
  if (Number.isFinite(n)) {
    return new Intl.NumberFormat(props.locale, {
      minimumFractionDigits: props.decimals,
      maximumFractionDigits: props.decimals
    }).format(n)
  }
  return String(props.value ?? '')
})
</script>

<style scoped>
.count-card{
  display:flex; flex-direction:column; justify-content:center; align-items:center;
  text-align:center; min-height:86px;
}
.value{ font-weight:700; font-size:22px; line-height:1.1; color:#111827; }
.label{ margin-top:6px; font-size:14px; color:#9ca3af; }
</style>
