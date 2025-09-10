<template>
  <BaseCard
    class="metric-card"
    :variant="variant"
    :pad="pad"
    :radius="radius"
    :clickable="clickable"
    :to="to"
    :href="href"
    :target="target"
    :rel="rel"
  >
    <!-- 헤더 -->
    <template #header>
      <div class="row head">
        <div class="title"><slot name="title">{{ title }}</slot></div>
        <div class="badge">
          <slot name="badge">
            <Pill v-if="badgeText" :text="badgeText" :variant="badgeVariant" tone="soft" size="sm" />
          </slot>
        </div>
      </div>
    </template>

    <!-- 본문 -->
    <div class="content">
      <div class="subtitle" v-if="$slots.subtitle || subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>

      <div class="spacer" />

      <div class="value">
        <slot name="value">
          <MetricValue
            :value="value"
            :decimals="decimals"
            :locale="locale"
            :currency="currency"
            size="xl"
          />
        </slot>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/cards/BaseCard.vue'
import Pill from '@/components/ui/Pill.vue'
import MetricValue from '@/components/ui/MetricValue.vue'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  value: { type: [Number, String, null], default: null },
  decimals: { type: Number, default: 1 },
  locale: { type: String, default: 'ko-KR' },
  currency: { type: String, default: '' },

  badgeText: { type: String, default: '' },
  // 'neutral' | 'success' | 'danger' | 'info' | 'warning'
  badgeVariant: { type: String, default: 'neutral' },

  /* BaseCard 전달용 (옵션) */
  variant: { type: String, default: 'outlined' },
  pad: { type: String, default: 'lg' },
  radius: { type: String, default: 'xl' },
  clickable: { type: Boolean, default: false },
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  target: { type: String, default: '_self' },
  rel: { type: String, default: '' },
})
</script>

<style scoped>
/* BaseCard가 테두리/패딩을 담당—여긴 내부 레이아웃만 */
.content { display: flex; flex-direction: column; min-height: 150px; }
.row.head{ display:flex; justify-content:space-between; align-items:center; gap:12px; }
.title{ font-weight:700; font-size:20px; color:#111827; letter-spacing:.01em; }
.subtitle{ color:#6b7280; margin-top:4px; }
.spacer{ flex:1 1 auto; }
.value{ margin-top:4px; }
</style>
