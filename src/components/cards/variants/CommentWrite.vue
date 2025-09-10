<template>
  <BaseCard
    as="form"
    variant="outlined"
    pad="lg"
    radius="xl"
    @submit.prevent="submit"
  >
    <!-- 헤더 -->
    <template #header>
      <h3 class="title">{{ title }}</h3>
    </template>

    <!-- 본문 -->
    <div class="composer">
      <div class="chips">
        <button
          v-for="opt in OPTIONS"
          :key="opt.key"
          type="button"
          class="chip"
          :class="[{ active: modelSentiment === opt.key }, `tone-${opt.tone}`]"
          :disabled="disabled || loading"
          :aria-pressed="modelSentiment === opt.key"
          @click="toggle(opt.key)"
        >
          {{ opt.label }}
        </button>
      </div>

      <!-- 반드시 닫는 태그 사용 -->
      <textarea
        class="text"
        v-model="text"
        :placeholder="placeholder"
        :maxlength="maxlength || undefined"
        :disabled="disabled || loading"
        rows="5"
      ></textarea>
    </div>

    <!-- 푸터 -->
    <template #footer>
      <div class="actions">
        <BaseButton
          type="submit"
          variant="primary"
          :loading="loading"
          :disabled="disabled || loading || !canSubmit"
        >
          {{ submitText }}
        </BaseButton>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/button/BaseButton.vue'

const props = defineProps({
  /** v-model */
  modelValue: { type: String, default: '' },
  /** v-model:sentiment */
  sentiment: { type: String, default: '' }, // '', 'strong-sell' | 'sell' | 'hold' | 'buy' | 'strong-buy'

  title: { type: String, default: '지금 당신의 생각을 남겨보세요' },
  placeholder: { type: String, default: '' },
  submitText: { type: String, default: '등록하기' },
  maxlength: { type: Number, default: 0 },

  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  requireSentiment: { type: Boolean, default: false }, // true면 선택 강제
  minLength: { type: Number, default: 0 },             // 본문 최소 글자수
})

const emit = defineEmits(['update:modelValue', 'update:sentiment', 'submit'])

const OPTIONS = [
  { key: 'strong-sell', label: 'Strong Sell', tone: 'danger'  },
  { key: 'sell',        label: 'Sell',        tone: 'warning' },
  { key: 'hold',        label: 'Hold',        tone: 'neutral' },
  { key: 'buy',         label: 'Buy',         tone: 'success' },
  { key: 'strong-buy',  label: 'Strong Buy',  tone: 'success' },
]

const modelSentiment = computed({
  get: () => props.sentiment,
  set: (v) => emit('update:sentiment', v)
})

function toggle(key) {
  modelSentiment.value = modelSentiment.value === key ? '' : key
}

const canSubmit = computed(() => {
  const okText = (props.modelValue?.trim().length || 0) >= props.minLength
  const okSent = props.requireSentiment ? !!modelSentiment.value : true
  return okText && okSent
})

function submit() {
  if (!canSubmit.value) return
  emit('submit', { text: props.modelValue.trim(), sentiment: modelSentiment.value })
}
</script>

<style scoped>
.composer{
  border:1px solid #cfd4dc; border-radius:18px; background:#fff;
  padding:16px; display:grid; gap:12px;
}
.title{ margin:0; font-size:18px; font-weight:700; color:#111827; }

.chips{ display:flex; flex-wrap:wrap; gap:10px; }
.chip{
  appearance:none; border:1px solid #cfd4dc; background:#fff; color:#111827;
  border-radius:999px; padding:8px 14px; cursor:pointer; font-weight:600;
}
.chip.active{ background:#111827; color:#fff; border-color:#111827; }

/* 색감(비활성 텍스트에만 살짝) */
.tone-success{ color:#16a34a; border-color:#bfe7cb; }
.tone-warning{ color:#b45309; border-color:#f3c99a; }
.tone-danger{  color:#991B1B; border-color:#f2b4b4; }
.tone-neutral{ color:#6b7280; border-color:#d8dce2; }

.text{
  width:100%; min-height:140px; resize:vertical;
  border:0; border-radius:12px; background:#eceff3; padding:14px;
  font: inherit; color:#111827;
}
.text:disabled{ opacity:.6; }

.actions{ display:flex; justify-content:flex-end; }
</style>
