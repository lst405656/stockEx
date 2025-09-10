<template>
  <BaseCard
    class="news-item"
    :variant="variant"
    :pad="pad"
    :radius="radius"
    :clickable="clickable || !!to || !!href"
    :to="to"
    :href="href"
    :target="target"
    :rel="rel"
  >
    <div class="row">
      <img
        v-if="image"
        class="thumb"
        :src="image"
        :alt="alt || title"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="thumb placeholder" aria-hidden="true" />

      <div class="meta">
        <div class="title" :title="title">{{ title }}</div>
        <div class="sub">
          <time v-if="dateText">{{ dateText }}</time>
          <span v-if="source"> {{ source }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '@/components/cards/BaseCard.vue'

const props = defineProps({
  image: { type: String, default: '' },
  alt: { type: String, default: '' },
  title: { type: String, required: true },
  date: { type: [String, Date], default: '' },
  dateFormat: { type: Intl.DateTimeFormat, default: null },
  source: { type: String, default: '' },

  // 링크/라우팅 (BaseCard로 전달)
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  target: { type: String, default: '_self' },
  rel: { type: String, default: '' },

  // BaseCard 스타일 제어 (옵션)
  variant: { type: String, default: 'outlined' }, // outlined | elevated | soft | ghost
  pad: { type: String, default: 'sm' },          // none | sm | md | lg
  radius: { type: String, default: 'lg' },       // md | lg | xl | full
  clickable: { type: Boolean, default: false },
})

const dateText = computed(() => {
  if (!props.date) return ''
  try {
    const d = typeof props.date === 'string' ? new Date(props.date) : props.date
    if (props.dateFormat) return props.dateFormat.format(d)
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(d).replace(/\./g, '.').replace(/\s/g, '')
  } catch { return String(props.date) }
})
</script>

<style scoped>
/* BaseCard가 테두리/패딩/호버 담당 → 내부 레이아웃만 정의 */
.row{
  display:grid; grid-template-columns: 112px 1fr; gap:12px; align-items:center;
}
.thumb{
  width:112px; height:72px; object-fit:cover; border-radius:12px; display:block;
  box-shadow: 0 1px 0 rgba(0,0,0,.04) inset;
}
.thumb.placeholder{ background:#e5e7eb; }
.meta{ min-width:0; }
.title{
  font-weight:600; color:#111827; line-height:1.3;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
.sub{ margin-top:6px; color:#6b7280; font-size:.9rem; }
.sub time::after{ content:' '; }
</style>
