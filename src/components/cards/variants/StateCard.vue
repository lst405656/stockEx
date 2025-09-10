<template>
  <BaseCard
    class="stat-card"
    :variant="variant"
    :pad="pad"
    :radius="radius"
    :clickable="clickable || !!to || !!href"
    :to="to"
    :href="href"
    :target="target"
    :rel="rel"
  >
    <!-- 헤더 -->
    <template #header>
      <div class="head">
        <div class="title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div class="badge">
          <slot name="badge">
            <Pill
              v-if="showBadgeComputed"
              :text="badgeText || formattedChange"
              :variant="badgeVariantAuto"
              tone="soft"
              size="sm"
            />
          </slot>
        </div>
      </div>
    </template>

    <!-- 본문 -->
    <div :class="['content', `trend-${trend}`]">
      <div class="subtitle" v-if="$slots.subtitle || subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>

      <div class="spacer" />

      <div class="value">
        <slot name="value">
          <MetricValue
            :value="value"
            :locale="locale"
            :decimals="decimals"
            :currency="currency"
            :compact="compact"
            size="xl"
          />
        </slot>
      </div>

      <div class="sub" v-if="showSub">
        <slot name="sub">
          <span class="label" v-if="subPrefix">{{ subPrefix }}</span>
          <span class="delta">{{ formattedChange }}</span>
        </slot>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '../BaseCard.vue'
import Pill from '@/components/ui/Pill.vue'
import MetricValue from '@/components/ui/MetricValue.vue' // 경로는 프로젝트 구조에 맞게 조정

const props = defineProps({
  /* 콘텐츠 */
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  value: { type: [Number, String], default: '' },
  locale: { type: String, default: 'ko-KR' },
  decimals: { type: Number, default: 2 },
  currency: { type: String, default: '' },
  compact: { type: Boolean, default: false },

  /* 변화/추세 */
  change: { type: Number, default: null },
  percentMode: { type: Boolean, default: true },
  trend: { type: String, default: '' },     // 'up' | 'down' | 'flat' | ''
  subPrefix: { type: String, default: '어제보다' },

  /* 뱃지 */
  badgeText: { type: String, default: '' },
  showBadge: { type: Boolean, default: true },

  /* BaseCard 전달용(옵션) */
  variant: { type: String, default: 'outlined' }, // outlined|elevated|soft|ghost
  pad: { type: String, default: 'lg' },           // none|sm|md|lg
  radius: { type: String, default: 'xl' },        // md|lg|xl|full
  clickable: { type: Boolean, default: false },
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  target: { type: String, default: '_self' },
  rel: { type: String, default: '' },
})

/* 추세 계산 */
const effTrend = computed(() => {
  if (props.trend) return props.trend
  if (props.change == null) return 'flat'
  if (props.change > 0) return 'up'
  if (props.change < 0) return 'down'
  return 'flat'
})
const trend = effTrend

/* 전일 대비 표기 */
const showSub = computed(() => props.change !== null && props.change !== undefined)
const formattedChange = computed(() => {
  if (!showSub.value) return ''
  const sign = props.change > 0 ? '+' : props.change < 0 ? '−' : ''
  const abs = Math.abs(props.change)
  return props.percentMode
    ? `${sign}${abs.toFixed(2)}%`
    : new Intl.NumberFormat(props.locale, {
        minimumFractionDigits: props.decimals,
        maximumFractionDigits: props.decimals
      }).format(props.change) // 부호 포함
})

/* 뱃지 자동 색상 & 표시 여부 */
const badgeVariantAuto = computed(() => ({ up:'success', down:'danger', flat:'neutral' }[effTrend.value] || 'neutral'))
const showBadgeComputed = computed(() => props.showBadge && (props.badgeText || showSub.value))
</script>

<style scoped>
/* BaseCard가 테두리/패딩 담당 → 내부 레이아웃만 */
.head{ display:flex; align-items:flex-start; justify-content:space-between; }
.title{ color:#111827; font-weight:700; letter-spacing:.01em; font-size:18px; }

.content{ display:flex; flex-direction:column; gap:12px; min-height:160px; }
.subtitle{ color:#6b7280; }
.spacer{ flex:1 1 auto; }
.value{ margin-top:4px; }

.sub{ font-weight:600; color:#16a34a; }
.trend-down .sub{ color:#ef4444; }
.trend-flat .sub{ color:#6b7280; }
.sub .label{ margin-right:6px; font-weight:500; color:#6b7280; }
</style>
