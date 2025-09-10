<template>
  <section class="card">
    <div class="back"><LinkText :to="{ path: '/' }">← 돌아가기</LinkText></div>

    <h1>환영해요</h1>
    <p class="sub">오늘도 stock101과 함께 똑똑한 투자 여정을 이어가세요</p>

    <form class="form" @submit.prevent="submitLogin" novalidate>
      <Field id="login-email" label="이메일" :error="submitted && !validEmail ? '이메일 형식을 확인해주세요.' : ''">
        <template #default="{ controlProps }">
          <EmailInput v-bind="controlProps" v-model="email" placeholder="you@example.com" />
        </template>
      </Field>

      <Field id="login-pw" label="비밀번호" :error="submitted && !password ? '비밀번호를 입력해주세요.' : ''">
        <template #default="{ controlProps }">
          <PasswordInput v-bind="controlProps" v-model="password" placeholder="비밀번호" />
        </template>
      </Field>

      <p class="hint" v-if="loginError">아이디 또는 비밀번호를 확인해 주세요</p>

      <BaseButton class="w-full" type="submit" variant="primary" :loading="loading">로그인</BaseButton>

      <p class="switch">
        계정이 없나요?
        <LinkText :to="{ path: '/auth', query: { type: 'register' } }">회원가입</LinkText>
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Field from '@/components/field/BaseField.vue'
import EmailInput from '@/components/inputs/variants/EmailInput.vue'
import PasswordInput from '@/components/inputs/variants/PasswordInput.vue'
import BaseButton from '@/components/button/BaseButton.vue'
import LinkText from '@/components/text/variants/LinkText.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const submitted = ref(false)
const loginError = ref(false)

const validEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value || ''))

async function submitLogin() {
  submitted.value = true
  loginError.value = false
  if (!validEmail.value || !password.value) return
  loading.value = true
  try {
    // TODO: 로그인 API 연동
    await new Promise(r => setTimeout(r, 600))
    router.push({ path: '/' })
  } catch {
    loginError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card { max-width: 560px; margin: 20px auto; padding: 28px 24px; border:1px solid #e5e7eb; border-radius:16px; background:#fff; }
.back { margin-bottom: 8px; }
h1 { font-size: 34px; line-height: 1.25; margin: 0 0 6px; }
.sub { margin: 0 0 24px; color: #6b7280; }
.form { display: grid; gap: 16px; }
.switch { margin-top: 12px; text-align: center; color: #6b7280; }
.hint { text-align:center; color:#6b7280; margin:8px 0 0; }
.w-full { width: 100%; }
</style>
