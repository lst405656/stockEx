<template>
  <section class="mypage" aria-labelledby="page-title">
    <!-- 본인일 때만 제목 노출 -->
    <h1 v-if="isSelf" id="page-title" class="title">나의 프로필</h1>

    <!-- 상단 통계 -->
    <BaseGrid :items="stats" :cols="5" gap="16px" itemKey="key" aria-label="프로필 통계">
      <template #default="{ item }">
        <CountCard :label="item.label">
          <template #value>
            <span :class="['stat', item.tone]">{{ item.valueFormatted }}</span>
          </template>
        </CountCard>
      </template>
    </BaseGrid>

    <!-- 프로필 헤더 -->
    <BaseCard variant="outlined" radius="xl" pad="lg">
      <div class="profile">
        <div class="avatar" :style="avatarStyle" />
        <div class="meta">
          <div class="name">
            {{ profile.name }}
            <span v-if="profile.verified" class="v" aria-label="인증됨" title="인증됨">🏅</span>
          </div>
          <div class="status">{{ profile.statusMessage }}</div>
        </div>

        <!-- 본인일 때만 편집 버튼 -->
        <BaseButton
          v-if="isSelf"
          class="edit"
          size="sm"
          variant="secondary"
          @click="onEdit"
        >
          수정하기
        </BaseButton>
      </div>
    </BaseCard>

    <!-- 탭: a11y + 딥링크 -->
    <div
      class="tabs"
      role="tablist"
      aria-label="프로필 탭"
      @keydown.left.prevent="goPrevTab"
      @keydown.right.prevent="goNextTab"
      @keydown.home.prevent="setTab(tabs[0])"
      @keydown.end.prevent="setTab(tabs[tabs.length - 1])"
    >
      <button
        v-for="t in tabs"
        :key="t"
        class="tab"
        role="tab"
        :id="`tab-${t}`"
        :aria-controls="`panel-${t}`"
        :aria-selected="activeTab === t ? 'true' : 'false'"
        :tabindex="activeTab === t ? 0 : -1"
        :class="{ active: activeTab === t }"
        type="button"
        @click="setTab(t)"
      >
        {{ TAB_LABEL[t] }}
      </button>
    </div>

    <!-- 필터 (예측 탭) -->
    <div class="toolbar" v-if="activeTab === 'pred'" role="region" aria-label="예측 필터">
      <SelectPill v-model="filter" :options="filterOptions" size="sm" />
    </div>

    <!-- 예측 카드 -->
    <BaseGrid
      v-if="activeTab === 'pred'"
      :items="filteredPreds"
      :minColWidth="300"
      gap="16px"
      itemKey="id"
      role="tabpanel"
      :aria-labelledby="`tab-pred`"
      :id="`panel-pred`"
    >
      <template #default="{ item }">
        <PredictionCard :name="item.name" :dateText="formatDate(item.date)" :status="item.status" />
      </template>

      <!-- 빈 상태 -->
      <template #empty>
        <BaseCard variant="outlined" radius="xl" pad="lg" aria-live="polite">
          <div style="display:flex; flex-direction:column; gap:8px;">
            <strong>표시할 예측이 없습니다.</strong>
            <span v-if="isSelf">첫 예측을 만들어보세요.</span>
            <span v-else>이 사용자는 아직 예측을 만들지 않았습니다.</span>
          </div>
        </BaseCard>
      </template>
    </BaseGrid>

    <!-- 게시물 목록 + 상세 -->
    <div
      v-else
      class="posts"
      role="tabpanel"
      :aria-labelledby="`tab-posts`"
      :id="`panel-posts`"
    >
      <BaseGrid :items="posts" :cols="1" gap="12px" itemKey="id">
        <template #default="{ item }">
          <BaseCard
            class="post-card"
            variant="outlined"
            radius="xl"
            pad="md"
            :clickable="true"
            @click="openPost(item)"
          >
            <div class="post-head">
              <div class="post-title">{{ item.title }}</div>
              <div class="post-date">{{ formatDate(item.createdAt) }}</div>
            </div>
            <div class="post-excerpt">{{ item.excerpt }}</div>
          </BaseCard>
        </template>

        <!-- 빈 상태 -->
        <template #empty>
          <BaseCard variant="outlined" radius="xl" pad="lg" aria-live="polite">
            <div style="display:flex; flex-direction:column; gap:8px;">
              <strong>게시물이 없습니다.</strong>
              <span v-if="isSelf">첫 게시물을 작성해보세요.</span>
              <span v-else>이 사용자는 아직 게시물이 없습니다.</span>
            </div>
          </BaseCard>
        </template>
      </BaseGrid>

      <BaseCard
        v-if="selectedPost"
        ref="detailRef"
        class="post-detail"
        variant="outlined"
        radius="xl"
        pad="lg"
      >
        <div class="detail-head">
          <h2 class="detail-title">{{ selectedPost.title }}</h2>
          <div class="detail-sub">{{ formatDate(selectedPost.createdAt, 'long') }}</div>
        </div>
        <div class="detail-body">{{ selectedPost.content }}</div>
        <div class="detail-actions">
          <BaseButton size="sm" variant="secondary" @click="selectedPost = null">닫기</BaseButton>
        </div>
      </BaseCard>
    </div>
  </section>
</template>

<script setup>
/**
 * 변경 요약
 * - /me 와 /users/:id 공용 사용: route.meta.self || id 비교 → isSelf
 * - 탭 딥링크: ?tab=pred|posts 동기화 (뒤로가기/공유 대응)
 * - 탭 접근성: role/tab/tabpanel/aria-* + 키보드 ← → Home End
 * - 빈 상태(예측/게시물) 슬롯 추가
 * - 날짜 포맷: Asia/Seoul 적용, 긴 형식 옵션
 */
import { computed, ref, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseGrid from '@/components/grid/BaseGrid.vue'
import BaseCard from '@/components/cards/BaseCard.vue'
import BaseButton from '@/components/button/BaseButton.vue'
import CountCard from '@/components/cards/variants/CountCard.vue'
import PredictionCard from '@/components/cards/variants/PredictionCard.vue'
import SelectPill from '@/components/select/variants/PillSelect.vue'

/* --- 라우트 & 모드 판별 --- */
const route = useRoute()
const router = useRouter()

// 예: 실제 앱에서는 인증 훅/스토어에서 현재 사용자 ID를 가져오세요.
const currentUserId = ref('me-123') // 데모용

const routeUserId = computed(() =>
  route.meta.self ? currentUserId.value : String(route.params.id || currentUserId.value)
)

const isSelf = computed(() =>
  Boolean(route.meta.self) || String(currentUserId.value) === String(route.params.id || '')
)

/* --- 더미 프로필 데이터 (실제에선 API 페칭) --- */
const profile = ref({
  name: isSelf.value ? '사용자 이름' : '다른 사용자',
  verified: true,
  statusMessage: isSelf.value ? '오늘도 한 걸음.' : '반갑습니다.'
})

/* --- 통계 --- */
const total = 0, success = 0, fail = 0, pending = 0, accuracy = 0
const stats = computed(() => ([
  { key: 'all',     label: '전체',     valueFormatted: String(total),   tone: ''    },
  { key: 'succ',    label: '예측 성공', valueFormatted: String(success), tone: 'ok'  },
  { key: 'fail',    label: '예측 실패', valueFormatted: String(fail),    tone: 'bad' },
  { key: 'pending', label: '결과 대기', valueFormatted: String(pending), tone: 'info'},
  { key: 'acc',     label: '정확도',   valueFormatted: `${accuracy}%`,   tone: ''    },
]))

/* --- 아바타 --- */
const avatarUrl = ''
const avatarStyle = computed(() => ({
  backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined
}))

/* --- 탭: 딥링크 + a11y --- */
const tabs = /** @type {const} */ (['pred', 'posts'])
const TAB_LABEL = { pred: '예측 목록', posts: '게시물 목록' }

// 초기 탭: 쿼리 우선, 없으면 pred
const activeTab = ref(tabs.includes(String(route.query.tab)) ? String(route.query.tab) : 'pred')

// 탭 ↔ 쿼리 동기화
watch(
  () => route.query.tab,
  (q) => {
    const normalized = tabs.includes(String(q)) ? String(q) : 'pred'
    if (normalized !== activeTab.value) activeTab.value = normalized
  }
)
watch(activeTab, (t) => {
  const q = new URLSearchParams(route.query)
  if (q.get('tab') !== t) {
    q.set('tab', t)
    router.replace({ query: Object.fromEntries(q.entries()) })
  }
})

// 탭 전환 유틸
function setTab(t) { if (tabs.includes(t)) activeTab.value = t }
function goPrevTab() {
  const i = tabs.indexOf(activeTab.value)
  setTab(tabs[(i - 1 + tabs.length) % tabs.length])
}
function goNextTab() {
  const i = tabs.indexOf(activeTab.value)
  setTab(tabs[(i + 1) % tabs.length])
}

/* --- 예측 탭 --- */
const filter = ref('all')
const filterOptions = [
  { label: '전체', value: 'all' },
  { label: '예측 성공', value: 'success' },
  { label: '예측 실패', value: 'fail' },
  { label: '결과 대기', value: 'pending' },
]
const predictions = ref([
  { id: 1, name: '종목 이름', date: '2025-08-26T10:00:00Z', status: 'up' },
  { id: 2, name: '종목 이름', date: '2025-08-20T09:00:00Z', status: 'neutral' },
  { id: 3, name: '종목 이름', date: '2025-08-18T14:30:00Z', status: 'down' },
])
const filteredPreds = computed(() => {
  if (filter.value === 'all') return predictions.value
  const map = { success: 'up', fail: 'down', pending: 'neutral' }
  return predictions.value.filter(p => p.status === map[filter.value])
})

/* --- 게시물 탭 --- */
const posts = ref([
  { id: 101, title: '첫 게시글 제목', createdAt: '2025-08-24T10:20:00Z', excerpt: '요약 한 줄…', content: '본문 내용 예시.' },
  { id: 102, title: '두 번째 글',     createdAt: '2025-08-20T09:00:00Z', excerpt: '요약 한 줄…', content: '본문 내용 예시 2.' },
])
const selectedPost = ref(null)
const detailRef = ref(null)
function openPost(item) {
  selectedPost.value = item
  nextTick(() => detailRef.value?.$el?.scrollIntoView?.({ behavior: 'smooth', block: 'start' }))
}

/* --- 날짜 포맷 (KST 고정 + 긴 형식 옵션) --- */
function formatDate(d, style = 'short') {
  try {
    const date = new Date(d)
    const base = {
      timeZone: 'Asia/Seoul',
      year: 'numeric', month: '2-digit', day: '2-digit'
    }
    const longOpt = { weekday: 'short', hour: '2-digit', minute: '2-digit' }
    return new Intl.DateTimeFormat('ko-KR', style === 'long' ? { ...base, ...longOpt } : base).format(date)
  } catch { return d }
}

/* --- 액션 --- */
function onEdit() {
  // 편집 다이얼로그/라우팅 등 연결
  // router.push({ name: 'profile-edit' }) 등으로 확장
}
</script>

<style scoped>
.mypage{ display:grid; gap:22px; padding: 8px 0 28px; }
.title{ font-size:28px; font-weight:800; margin:0 0 8px; }

/* 통계 색 */
.stat.ok{ color:#16a34a; }
.stat.bad{ color:#ef4444; }
.stat.info{ color:#6366f1; }

/* 프로필 레이아웃 */
.profile{
  display:grid;
  grid-template-columns: 72px 1fr auto; /* 아바타 / 내용 / 버튼 */
  align-items:center;
  gap:16px;
}
.avatar{
  width:72px; height:72px; border-radius:20px;
  background:#eef1f4 center/cover no-repeat; border:1px solid #e5e7eb;
  box-shadow: 0 1px 0 rgba(0,0,0,.04) inset;
}
.meta{ min-width:0; }
.name{
  display:flex; align-items:center; gap:8px;
  font-weight:800; font-size:20px; color:#111827;
  white-space:normal; word-break:keep-all;
}
.v{ font-size:18px; }
.status{ color:#6b7280; margin-top:4px; }
.edit{ justify-self:end; }

/* 탭 */
.tabs{ display:flex; gap:24px; margin-top:4px; }
.tab{
  appearance:none; background:none; border:0; padding:10px 2px; cursor:pointer;
  color:#6b7280; font-weight:700; position:relative;
}
.tab.active{ color:#111827; }
.tab.active::after{
  content:''; position:absolute; left:0; right:0; bottom:-2px; height:2px; background:#111827; border-radius:2px;
}

/* 툴바 */
.toolbar{ display:flex; align-items:center; gap:8px; margin:4px 0 4px; }

/* 게시물 */
.posts{ display:grid; gap:16px; }
.post-card{ transition: background .15s; }
.post-card:hover{ background:#fafafa; }
.post-head{ display:flex; gap:10px; align-items:center; }
.post-title{ font-weight:700; color:#111827; }
.post-date{ margin-left:auto; color:#9ca3af; font-size:.9rem; }
.post-excerpt{ margin-top:6px; color:#6b7280; }

.post-detail{ display:grid; gap:10px; }
.detail-head{ display:flex; gap:10px; align-items:end; }
.detail-title{ margin:0; font-size:20px; font-weight:800; }
.detail-sub{ margin-left:auto; color:#9ca3af; }
.detail-body{ color:#111827; line-height:1.7; white-space:pre-wrap; }
.detail-actions{ display:flex; justify-content:flex-end; }
</style>
