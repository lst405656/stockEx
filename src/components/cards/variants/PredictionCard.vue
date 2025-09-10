<!-- src/components/cards/PredictionCard.vue -->
<template>
  <BaseCard
    class="prediction-card"
    variant="outlined"
    :radius="radius"
    :pad="pad"
    :clickable="!!to || !!href"
    :to="to"
    :href="href"
    :target="target"
  >
    <div class="row">
      <div class="name"><slot name="name">{{ name }}</slot></div>
      <div v-if="dateText" class="date"><slot name="date">{{ dateText }}</slot></div>
      <div class="spacer" />
      <div class="badge">
        <slot name="badge">
          <Pill :text="badgeLabel" :variant="badgeVariant" tone="soft" size="sm" />
        </slot>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '@/components/cards/BaseCard.vue'
import Pill from '@/components/ui/Pill.vue'

const props = defineProps({
  name: { type: String, default: '' },
  dateText: { type: String, default: '' },

  /** 상태: 'up' | 'down' | 'neutral' */
  status: { type: String, default: 'up' },
  statusText: { type: String, default: '' },   // 표시 텍스트를 커스터마이즈하고 싶을 때

  // 링크 옵션
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  target: { type: String, default: '_self' },

  // 카드 스타일 옵션
  pad: { type: String, default: 'lg' },
  radius: { type: String, default: 'xl' },
})

const badgeLabel = computed(() => props.statusText || (props.status === 'up' ? 'UP' : props.status === 'down' ? 'DOWN' : 'HOLD'))
const badgeVariant = computed(() => {
  switch (props.status) {
    case 'up': return 'success'
    case 'down': return 'danger'
    default: return 'neutral'
  }
})
</script>

<style scoped>
.prediction-card { min-height: 76px; display:flex; align-items:center; }
.row { display:flex; align-items:center; gap:16px; width:100%; }
.name { font-weight: 800; font-size: 20px; color:#111827; }
.date { color:#9ca3af; }
.spacer { flex:1 1 auto; }
.badge :deep(.pill) { /* 선택: 배지와 간격 조정이 필요하면 사용 */ }
</style>
