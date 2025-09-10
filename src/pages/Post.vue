<template>
  <section class="wrap">
    <!-- 상단 대표 의견 카드 -->
    <CommentCard
      :avatar="main.avatar"
      :username="main.username"
      :verified="main.verified"
      :timeText="main.time"
      :sentiment="main.sentiment"
    >
      {{ main.text }}

      <!-- 카드 하단 리액션 -->
      <template #footer>
        <div class="actions">
          <LikeButton
            v-model="main.liked"
            :count="main.likes"
            :optimistic="true"
          />
          <CommentButton
            :count="main.comments"
            @click="scrollToComposer"
          />
        </div>
      </template>
    </CommentCard>

    <!-- 인라인 입력 -->
    <div class="composer" ref="composerRef">
      <label class="label">의견을 남겨주세요</label>
      <div class="row">
        <BaseInput
          class="inp"
          v-model="input"
          placeholder="의견을 남겨주세요"
          @keyup.enter="submit"
        />
        <BaseButton class="btn" :disabled="!canSubmit" @click="submit">등록하기</BaseButton>
      </div>
    </div>

    <!-- 하단 리스트 -->
    <!-- template -->
    <BaseGrid
        :items="items"
        itemKey="id"
        :cols="{ base: 1, md: 1, lg: 1 }"
        gap="12px"
    >
    <template #default="{ item }">
        <CommentCard
            :avatar="item.avatar"
            :username="item.username"
            :verified="item.verified"
            :timeText="item.time"
            :sentiment="item.sentiment"
        />
    </template>
</BaseGrid>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseGrid from '@/components/grid/BaseGrid.vue'
import CommentCard from '@/components/cards/variants/Comment.vue'
import LikeButton from '@/components/button/variants/LikeButton.vue'
import CommentButton from '@/components/button/variants/CommentButton.vue'
import BaseInput from '@/components/inputs/BaseInput.vue'
import BaseButton from '@/components/button/BaseButton.vue'

const composerRef = ref(null)

const main = ref({
  avatar: '',
  username: '사용자 이름',
  verified: true,
  time: '작성 시간',
  sentiment: 'strong-buy',
  text: '테슬라가 4분기 실적에서 기대를 뛰어넘었어요! 자율주행과 에너지 저장 사업에 집중하는 만큼 2025년엔 큰 성장이 기대됩니다. 저는 강력 매수 의견입니다!',
  likes: 24,
  comments: 8,
  liked: false,
})

const input = ref('')
const canSubmit = computed(() => (input.value.trim().length || 0) > 0)

const items = ref([
  { id: 1, avatar: '', username: '사용자 이름', verified: false, time: '작성 시간', sentiment: 'hold' },
  { id: 2, avatar: '', username: '사용자 이름', verified: false, time: '작성 시간', sentiment: 'hold' },
  { id: 3, avatar: '', username: '사용자 이름', verified: false, time: '작성 시간', sentiment: 'hold' },
  { id: 4, avatar: '', username: '사용자 이름', verified: false, time: '작성 시간', sentiment: 'hold' },
])

function submit() {
  if (!canSubmit.value) return
  items.value.unshift({
    id: Date.now(),
    avatar: '',
    username: '사용자 이름',
    verified: false,
    time: '방금',
    sentiment: 'hold',
  })
  input.value = ''
}

function scrollToComposer() {
  composerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.wrap { display:grid; gap:24px; }

/* 카드 하단 리액션 */
.actions { display:flex; align-items:center; gap:14px; color:#6b7280; }

/* 인라인 입력 */
.composer { display:grid; gap:8px; }
.label { color:#6b7280; font-weight:600; }
.row { display:grid; grid-template-columns: 1fr auto; gap:8px; align-items:center; }
.inp { height:44px; }
.btn { height:44px; }

/* 리스트 */
.list { display:grid; gap:12px; }
</style>
