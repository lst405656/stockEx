<template>
  <section class="page">

    <!-- 헤더 -->
    <header class="hero">
      <div class="hero__left">
        <h1>Stock 101</h1>
        <p class="tagline">시장의 지표들을 한눈에 찾아보고, 새로운 투자 관점을 탐험해보세요.</p>
      </div>
      <div class="hero__actions">
        <BaseButton class="btn" @click="goRegister">회원 가입</BaseButton>
        <BaseButton class="btn btn--primary" @click="goLogin">로그인</BaseButton>
      </div>
    </header>

    <!-- 주요 지수 -->
    <section class="sec">
      <BaseGrid :items="indices" :cols="3" gap="16px" itemKey="id">
        <template #default="{ item }">
          <StatCard
            :title="item.title"
            :subtitle="item.subtitle"
            :value="item.value"
            :change="item.change"
            :percentMode="true"
          />
        </template>
      </BaseGrid>
    </section>

    <!-- 지금 주목 받는 주식 -->
    <section class="sec">
      <h2 class="sec__title">지금 주목 받는 주식</h2>
      <BaseGrid :items="hotStocks" :cols="3" gap="16px" itemKey="id">
        <template #default="{ item }">
          <StatCard
            :title="item.symbol"
            :subtitle="item.name"
            :value="item.price"
            :change="item.change"
            :percentMode="true"
            @click="goStock(item.symbol)" 
          />
        </template>
      </BaseGrid>
    </section>

    <!-- 최근 핫한 뉴스 -->
    <section class="sec">
      <h2 class="sec__title">최근 핫한 뉴스</h2>
      <BaseGrid :items="newsCols" :cols="2" gap="24px">
        <template #default="{ item: col }">
          <div class="news-col">
            <NewsCard
              v-for="n in col"
              :key="n.id"
              :image="n.image"
              :title="n.title"
              :date="n.date"
              :source="n.source"
              :href="n.href"
              target="_blank"
            />
          </div>
        </template>
      </BaseGrid>
    </section>

    <!-- 최강의 투자자들 -->
    <section class="sec">
      <h2 class="sec__title">최강의 투자자들</h2>
      <BaseGrid :items="investors" :cols="2" gap="16px" itemKey="id">
        <template #default="{ item }">
          <ProfileCard
            :avatar="item.avatar"
            :name="item.name"
            :status="item.status"
            :verified="item.verified"
            @click="goProfile(item)"
          />
        </template>
      </BaseGrid>
    </section>

  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import BaseGrid from '@/components/grid/BaseGrid.vue'
import StatCard from '@/components/card/variants/StatCard.vue'
import NewsCard from '@/components/card/variants/NewsCard.vue'
import ProfileCard from '@/components/card/variants/ProfileCard.vue'
import BaseButton from '@/components/button/BaseButton.vue'

const router = useRouter()
const goLogin = () => router.push({ path: '/auth', query: { type: 'login' } })
const goRegister = () => router.push({ path: '/auth', query: { type: 'register' } })
const goProfile = (item) => {
  const path = item.id == 'me' ? '/me' : `/users/${item.id}`
  router.push({ path })
}
const goStock = (ticker) => router.push({ path: `/stock/${ticker}` })

/* 데모 데이터 — API 연동부로 대체 가능 */
const indices = ref([])
const hotStocks = ref([])
const news = ref([])
const investors = ref([])

onMounted(() => {
  indices.value = [
    { id: 'spx',   title: 'S&P 500', subtitle: '', value: 4567.89, change: 1.23 },
    { id: 'ndaq',  title: 'NASDAQ',  subtitle: '', value: 14234.56, change: -0.89 },
    { id: 'dow',   title: 'DOW',     subtitle: '', value: 34789.12, change: 0.05 },
  ]

  hotStocks.value = [
    { id: 'tsla', symbol: 'TSLA', name: 'Tesla Inc.', price: 248.5, change: 2.45 },
    { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', price: 175.84, change: -0.87 },
    { id: 'tsla2', symbol: 'TSLA', name: 'Tesla Inc.', price: 248.5, change: 2.45 },
    // 빈 카드 느낌을 내려면 배열 길이를 맞추고, 템플릿에서 v-if 처리해도 됨
  ]

  news.value = [
    {
      id: 'n1',
      image: 'https://picsum.photos/seed/nvda/224/144', // 데모 이미지
      title: '다시 불거진 AI 버블론…엔비디아, 구세주 될까?',
      date: '2024-08-24',
      source: '이데일리',
      href: '#'
    },
    {
      id: 'n2',
      image: 'https://picsum.photos/seed/ai/224/144',
      title: '다시 불거진 AI 버블론…엔비디아, 구세주 될까?',
      date: '2024-08-24',
      source: '이데일리',
      href: '#'
    },
    // 플레이스홀더 느낌의 아이템들 (이미지 없이)
    { id: 'n3', image: '', title: 'Title', date: '2024-08-21', source: '일부 발행처', href: '#' },
    { id: 'n4', image: '', title: 'Title', date: '2024-08-21', source: '일부 발행처', href: '#' },
  ]

  investors.value = [
    { id: 1, avatar: '', name: '사용자 이름', status: '사용자의 한마디 (상태 메시지)', verified: true },
    { id: 2, avatar: '', name: '사용자 이름', status: '사용자의 한마디 (상태 메시지)', verified: true },
    { id: 3, avatar: '', name: '사용자 이름', status: '사용자의 한마디 (상태 메시지)', verified: true },
    { id: 'me', avatar: '', name: '내 아이디', status: '사용자의 한마디 (상태 메시지)', verified: true },
  ]
})

/* 뉴스 2열로 나누기 */
const newsCols = computed(() => {
  const a = [], b = []
  news.value.forEach((n, i) => (i % 2 === 0 ? a : b).push(n))
  return [a, b]
})
</script>

<style scoped>
.page { padding: 28px 20px 40px; display: grid; gap: 28px; }

/* Hero */
.hero { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
.hero__left h1 { margin: 0 0 6px; font-size: 32px; }
.tagline { margin: 0; color:#6b7280; }
.hero__actions { display:flex; gap:8px; align-items:center; }
.btn { border-radius:999px; padding:10px 16px; background:#eef2f7; border:1px solid #e5e7eb; }
.btn--primary { background:#111827; color:#fff; border-color:#111827; }

.sec { display: grid; gap: 12px; }
.sec__title { font-size: 18px; margin: 0; }

.news-col { display:grid; gap: 12px; }
</style>
