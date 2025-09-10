<template>
  <section class="page">

    <!-- 상단: 뒤로가기 / 종목 타이틀 / 현재가 -->
    <div class="back"><LinkText :to="{ name: 'main' }">← 돌아가기</LinkText></div>
    <header class="top">
      <div class="left">
        <h1 class="ticker">{{ ticker }}</h1>
        <p class="company">{{ company }}</p>
      </div>
      <div class="right">
        <div class="price">{{ priceNowText }}</div>
        <div :class="['delta', deltaClass]">{{ deltaText }}</div>
      </div>
    </header>

    <!-- 투자 나침반(게이지 3개) -->
    <section class="sec">
      <h2 class="sec-title">{{ ticker }}의 투자 나침반</h2>
      <div class="gauges">
        <SentimentGauge :value="miniLeft" title="분위기 지표" :size="220" />
        <SentimentGauge :value="sentiment" title="개미 지표" nextUpdateText="03:35 후에 갱신될 거예요" :size="300" />
        <SentimentGauge :value="miniRight" title="뉴스 지표" :size="220" />
      </div>
    </section>

    <!-- 재무 지표 -->
    <section class="sec">
      <h2 class="sec-title">{{ ticker }}의 재무 지표</h2>
      <BaseGrid :items="metrics" :cols="3" gap="16px" itemKey="key">
        <template #default="{ item }">
          <MetricCard
            :title="item.title"
            :subtitle="item.subtitle"
            :value="item.value"
            :badgeText="item.badgeText"
            :badgeVariant="item.variant"
            pad="lg"
          />
        </template>
      </BaseGrid>
    </section>

    <!-- 주가 차트 + CTA -->
    <section class="sec">
      <StockPriceChart :data="series" currency="USD" :height="360" :area="true" />
      <div class="cta-row">
        <BaseButton class="cta neg" @click="noop">주가가 내려갈 거예요</BaseButton>
        <BaseButton class="cta pos" @click="noop">주가가 올라갈 거예요</BaseButton>
      </div>
      <p class="hint">[등록하면 주가를 이메일로 보내요]</p>
    </section>

    <!-- 커뮤니티 -->
    <section class="sec">
      <h2 class="sec-title">커뮤니티 대화</h2>

      <CommentWrite
        v-model="composeText"
        v-model:sentiment="composeSentiment"
        placeholder="지금 당신의 생각을 남겨보세요"
        :minLength="1"
        submitText="등록하기"
        @submit="postOpinion"
      />

      <div class="op-list">
        <Comment
          v-for="op in opinions"
          :key="op.id"
          :username="op.username"
          :verified="op.verified"
          :timeText="op.time"
          :sentiment="op.sentiment"
          @click="goPost(op.id)"
        >
          {{ op.text }}
        </Comment>
      </div>
    </section>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LinkText from '@/components/text/variants/LinkText.vue'
import BaseGrid from '@/components/grid/BaseGrid.vue'
import MetricCard from '@/components/cards/variants/MetricCard.vue'
import SentimentGauge from '@/components/charts/variants/GaugeChart.vue'
import StockPriceChart from '@/components/charts/variants/TimeChart.vue'
import BaseButton from '@/components/button/BaseButton.vue'
import CommentWrite from '@/components/cards/variants/CommentWrite.vue'
import Comment from '@/components/cards/variants/Comment.vue'

/* 헤더 데이터 */
const ticker = 'TSLA'
const company = 'Tesla Inc.'

/* 게이지 데모 값 */
const sentiment = 58
const miniLeft = 35
const miniRight = 72

/* 재무 지표 카드 데이터 */
const metrics = ref([
  { key: 'per1', title: 'PER', subtitle: 'Price-to-Earnings Ratio', value: 4.2, badgeText: 'neutral', variant: 'neutral' },
  { key: 'per2', title: 'PER', subtitle: 'Price-to-Earnings Ratio', value: 4.2, badgeText: 'poor',    variant: 'danger'  },
  { key: 'ebs',  title: 'EBS', subtitle: 'Earnings Before Split',   value: 4.2, badgeText: 'good',    variant: 'success' },
])

/* 시계열(데모) */
const series = ref([])
onMounted(() => {
  // 간단한 데모 시계열 생성 (1년)
  const start = new Date()
  start.setFullYear(start.getFullYear() - 1)
  const pts = []
  let v = 176
  for (let i = 0; i < 365; i++) {
    const t = new Date(+start + i * 24 * 3600 * 1000)
    v += (Math.random() - 0.45) * 2
    pts.push({ t, y: Math.max(120, v + i * 0.15) })
  }
  series.value = pts
})

/* 헤더 현재가/등락 계산(차트 데이터 기준) */
const last = computed(() => series.value.at(-1)?.y ?? null)
const first = computed(() => series.value.at(0)?.y ?? null)
const delta = computed(() => (last.value != null && first.value != null) ? last.value - first.value : null)
const deltaPct = computed(() => (delta.value != null && first.value ? (delta.value / first.value) * 100 : null))

const priceNowText = computed(() =>
  last.value == null ? '—' : new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format(last.value)
)
const deltaText = computed(() => {
  if (delta.value == null) return ''
  const sign = delta.value > 0 ? '+' : delta.value < 0 ? '−' : ''
  const absPct = Math.abs(deltaPct.value ?? 0).toFixed(2)
  return `${sign}${absPct}%`
})
const deltaClass = computed(() => delta.value > 0 ? 'pos' : delta.value < 0 ? 'neg' : 'flat')

/* 커뮤니티 */
const composeText = ref('')
const composeSentiment = ref('')
const opinions = ref([
  {
    id: 1,
    username: 'StockerA',
    verified: true,
    time: '작성 1시간',
    sentiment: 'strong-buy',
    text: '테슬라가 4분기 실적에서 기대를 뛰어넘었어요! 자율주행과 에너지 저장 사업에 집중하는 만큼 2024년엔 큰 성장이 기대됩니다.'
  },
  { id: 2, username: 'StockerB', verified: false, time: '작성 3시간', sentiment: 'hold', text: '단기 과열인 듯, 분할 매수 고려합니다.' },
  { id: 3, username: 'StockerC', verified: false, time: '작성 1일',    sentiment: 'sell', text: '실적 대비 밸류 부담이 있어 보입니다.' },
])

function postOpinion({ text, sentiment }) {
  opinions.value.unshift({
    id: Date.now(),
    username: '나',
    verified: true,
    time: '방금',
    sentiment,
    text
  })
  composeText.value = ''
  composeSentiment.value = ''
}

const goPost = (item) => router.push({ path: `/post/${item}` })

const noop = () => {}
</script>

<style scoped>
.page{ padding: 20px; display: grid; gap: 22px; }
.back{ margin-bottom: -8px; }

.top{ display:flex; justify-content:space-between; align-items:flex-start; }
.ticker{ margin:0; font-size: 28px; }
.company{ margin:4px 0 0; color:#6b7280; }
.right{ text-align:right; }
.price{ font-weight:800; font-size:20px; }
.delta{ font-weight:600; }
.delta.pos{ color:#16a34a; } .delta.neg{ color:#ef4444; } .delta.flat{ color:#6b7280; }

.sec{ display:grid; gap:12px; }
.sec-title{ margin:0; font-size:18px; }

.gauges{
  display:grid; grid-template-columns: 1fr 1.2fr 1fr; gap:16px;
  align-items:center; justify-items:center;
}

.cta-row{
  display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:10px;
}
.cta{ width:100%; }
.cta.neg{ background:#fde2e2; border:1px solid #f5b5b5; color:#991b1b; }
.cta.pos{ background:#dff7e7; border:1px solid #bfe7cb; color:#166534; }

.hint{ text-align:center; color:#9ca3af; font-size:.9rem; }

.op-list{ display:grid; gap:10px; }
</style>
