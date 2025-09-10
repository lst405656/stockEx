<template>
  <BaseCard
    class="user-card"
    :variant="variant"
    :pad="pad"
    :radius="radius"
    :clickable="clickable || !!to || !!href"
    :to="to"
    :href="href"
    :target="target"
    :rel="rel"
  >
    <div class="row" :class="`s-${size}`">
      <div class="avatar-wrap">
        <img
          v-if="avatar"
          :src="avatar"
          :alt="altText"
          class="avatar"
          loading="lazy"
          decoding="async"
        />
        <div v-else class="avatar placeholder" aria-hidden="true" />
      </div>

      <div class="body">
        <div class="name-line">
          <span class="name">{{ name }}</span>
          <slot name="badge">
            <span v-if="verified" class="badge" aria-label="verified">🏅</span>
          </slot>
        </div>
        <div v-if="status" class="status">{{ status }}</div>
        <slot />
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '../BaseCard.vue'

const props = defineProps({
  avatar:   { type: String, default: '' },
  name:     { type: String, required: true },
  status:   { type: String, default: '' },
  verified: { type: Boolean, default: false },
  alt:      { type: String, default: '' },

  // 링크/라우터(BasicCard로 그대로 전달)
  to:     { type: [String, Object], default: null },
  href:   { type: String, default: '' },
  target: { type: String, default: '_self' },
  rel:    { type: String, default: '' },

  // BaseCard 스타일 제어
  variant:   { type: String, default: 'outlined' }, // outlined | elevated | soft | ghost
  pad:       { type: String, default: 'md' },       // none | sm | md | lg
  radius:    { type: String, default: 'xl' },       // md | lg | xl | full
  clickable: { type: Boolean, default: false },

  // 크기 프리셋
  size: { type: String, default: 'md' } // sm | md | lg
})

const altText = computed(() => props.alt || `${props.name}의 아바타`)
</script>

<style scoped>
/* BaseCard가 테두리/패딩/호버 담당 → 내부 레이아웃만 정의 */
.row{
  display:grid; grid-template-columns: 64px 1fr; gap:12px; align-items:center;
}
.s-sm{ grid-template-columns: 48px 1fr; }
.s-lg{ grid-template-columns: 72px 1fr; }

.avatar-wrap{
  width:64px; height:64px; border-radius:12px; overflow:hidden;
}
.s-sm .avatar-wrap{ width:48px; height:48px; border-radius:10px; }
.s-lg .avatar-wrap{ width:72px; height:72px; border-radius:14px; }

.avatar{ width:100%; height:100%; object-fit:cover; display:block; }
.avatar.placeholder{ background:#e5e7eb; }

.body{ min-width:0; padding-right:8px; }
.name-line{ display:flex; align-items:center; gap:6px; }
.name{ font-weight:700; color:#111827; }
.badge{ font-size:18px; line-height:1; }
.status{ margin-top:6px; color:#6b7280; }
</style>
