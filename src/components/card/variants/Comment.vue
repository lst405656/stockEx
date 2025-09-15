<template>
  <BaseCard variant="outlined" pad="md" radius="xl" :to="to" :href="href" :target="target" :clickable="true">
    <template #header>
      <div class="row">
        <div class="avatar" :style="avatarStyle" />
        <Pill class="pill" :text="sentimentLabel" :variant="sentimentVariant" tone="soft" size="sm" />
        <span class="name">{{ username }}</span>
        <span v-if="verified" class="verified">🏅</span>
        <span class="time" v-if="timeText">{{ timeText }}</span>
      </div>
    </template>

    <slot>{{ content }}</slot>

    <template #footer>
      <slot name="footer" />
    </template>
  </BaseCard>
</template>


<script setup>
import { computed } from 'vue'
import Pill from '@/components/ui/Pill.vue'
import BaseCard from '@/components/card/BaseCard.vue'

const props = defineProps({
  avatar: { type: String, default: '' },
  username: { type: String, required: true },
  verified: { type: Boolean, default: false },
  timeText: { type: String, default: '' },
  content: { type: String, default: '' },

  /** 'strong-sell' | 'sell' | 'hold' | 'buy' | 'strong-buy' */
  sentiment: { type: String, default: 'hold' },

  // 링크 옵션
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  target: { type: String, default: '_self' },
  rel: { type: String, default: '' },
})

const isRouter = computed(() => !!props.to && !props.href)
const relComputed = computed(() => {
  if (props.rel) return props.rel
  if (props.href && props.target === '_blank') return 'noopener noreferrer'
  return undefined
})

/* 아바타 원형(비어있으면 회색) */
const avatarStyle = computed(() => ({
  backgroundImage: props.avatar ? `url(${props.avatar})` : undefined
}))

/* 감정 라벨/색상 매핑 */
const MAP = {
  'strong-sell': { label: 'Strong Sell', variant: 'danger'  },
  'sell':        { label: 'Sell',        variant: 'warning' },
  'hold':        { label: 'Hold',        variant: 'neutral' },
  'buy':         { label: 'Buy',         variant: 'success' },
  'strong-buy':  { label: 'Strong Buy',  variant: 'success' },
}
const sentimentLabel = computed(() => (MAP[props.sentiment] || MAP.hold).label)
const sentimentVariant = computed(() => (MAP[props.sentiment] || MAP.hold).variant)
</script>

<style scoped>
.op-card{
  display:grid; gap:10px;
  border:1px solid #cfd4dc; border-radius:18px; background:#fff;
  padding:12px 16px; color:inherit; text-decoration:none;
}
.row.head{ display:flex; justify-content:space-between; align-items:center; gap:8px; }
.left{ display:flex; align-items:center; gap:10px; min-width:0; }
.avatar{
  width:36px; height:36px; border-radius:999px; flex:0 0 auto;
  background:#e5e7eb center/cover no-repeat;
  border:1px solid #e5e7eb;
}
.pill{ margin-left:2px; }
.name{ font-weight:700; color:#111827; }
.verified{ font-size:18px; line-height:1; }

.time{ color:#9ca3af; white-space:nowrap; }

.body{
  color:#111827; line-height:1.6;
  /* 한 줄 이상 길어져도 자연스럽게 */
  word-break: break-word;
}
</style>
