<template>
  <section class="card">
    <div class="back"><LinkText :to="{ path: '/' }">← 돌아가기</LinkText></div>

    <h1>Stock101에서<br />투자 여정을 시작하세요</h1>
    <p class="sub">계정을 만들고 시장의 흐름을 함께 경험해보세요</p>

    <form class="form" @submit.prevent="onSubmit" novalidate>
      <Field id="name" label="이름" :error="submitted ? errors.name : ''" :required="true">
        <template #default="{ controlProps }">
          <BaseInput v-bind="controlProps" v-model="name" placeholder="이름" />
        </template>
      </Field>

      <Field id="email" label="이메일" :error="submitted ? errors.email : ''" :required="true">
        <template #default="{ controlProps }">
          <EmailInput v-bind="controlProps" v-model="email" placeholder="you@example.com" />
        </template>
      </Field>

      <Field id="pw" label="비밀번호" :error="submitted ? errors.pw : ''" :required="true">
        <template #default="{ controlProps }">
          <PasswordInput
            v-bind="controlProps"
            v-model="pw"
            placeholder="비밀번호"
            autocomplete="new-password"
            @change="onPwChange"
          />
        </template>
      </Field>

      <Field id="pw2" label="비밀번호 확인" :error="(submitted || pw2Changed) ? errors.pw2 : ''" :required="true">
        <template #default="{ controlProps }">
          <PasswordInput
            v-bind="controlProps"
            v-model="pw2"
            placeholder="비밀번호 확인"
            autocomplete="new-password"
            @change="onPw2Change"
          />
        </template>
      </Field>

      <Field id="agree" :error="submitted ? errors.agree : ''" :required="true">
        <template #default="{ controlProps }">
          <label class="checkline">
            <BaseCheckbox v-bind="controlProps" v-model="agree" />
            <span>약관 및 개인정보 처리방침 동의하기(필수)</span>
          </label>
        </template>
      </Field>

      <Field id="newsletter">
        <template #default="{ controlProps }">
          <label class="checkline">
            <BaseCheckbox v-bind="controlProps" v-model="newsletter" />
            <span>뉴스레터 구독하고 똑똑한 투자 시작하기(선택)</span>
          </label>
        </template>
      </Field>

      <BaseButton type="submit" variant="primary" size="lg" class="w-full mt-2" :loading="submitting" :disabled="submitting">
        회원 가입
      </BaseButton>

      <p class="switch">
        계정이 이미 있다면 <LinkText :to="{ path: '/auth', query: { type: 'login' } }">로그인</LinkText> 해주세요
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import Field from '@/components/field/BaseField.vue'
import BaseInput from '@/components/inputs/BaseInput.vue'
import EmailInput from '@/components/inputs/variants/EmailInput.vue'
import PasswordInput from '@/components/inputs/variants/PasswordInput.vue'
import BaseCheckbox from '@/components/checkbox/BaseCheckbox.vue'
import BaseButton from '@/components/button/BaseButton.vue'
import LinkText from '@/components/text/variants/LinkText.vue'

const router = useRouter()

const name = ref('')
const email = ref('')
const pw = ref('')
const pw2 = ref('')
const agree = ref(false)
const newsletter = ref(false)

const submitting = ref(false)
const submitted  = ref(false)
const pw2Changed = ref(false)

const errors = reactive({ name: '', email: '', pw: '', pw2: '', agree: '' })

function validateName() { errors.name = name.value ? '' : '이름을 입력해주세요.' }
function validateEmail() {
  if (!email.value) return (errors.email = '이메일을 입력해주세요.')
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  errors.email = EMAIL.test(email.value) ? '' : '이메일 형식이 올바르지 않습니다.'
}
function validatePw() {
  if (!pw.value) errors.pw = '비밀번호를 입력해주세요.'
  else if (pw.value.length < 8) errors.pw = '8자 이상 입력해주세요.'
  else errors.pw = ''
}
function validatePw2() {
  if (!pw2.value) errors.pw2 = '비밀번호 확인을 입력해주세요.'
  else if (pw.value !== pw2.value) errors.pw2 = '비밀번호가 일치하지 않습니다'
  else errors.pw2 = ''
}
function validateAgree() { errors.agree = agree.value ? '' : '필수 동의 항목입니다.' }

function onPw2Change() { pw2Changed.value = true; validatePw2() }
function onPwChange()   { if (pw2Changed.value) validatePw2() }

function validateAll() { validateName(); validateEmail(); validatePw(); validatePw2(); validateAgree() }
const formInvalid = computed(() => !!(errors.name || errors.email || errors.pw || errors.pw2 || errors.agree))

async function onSubmit() {
  submitted.value = true
  validateAll()
  if (formInvalid.value) return
  submitting.value = true
  try {
    // TODO: 가입 API
    await new Promise(r => setTimeout(r, 800))
    router.push({ path: '/auth', query: { type: 'login' } })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.card { max-width: 560px; margin: 20px auto; padding: 28px 24px; border:1px solid #e5e7eb; border-radius:16px; background:#fff; }
.back { margin-bottom: 8px; }
h1 { font-size: 34px; line-height: 1.25; margin: 0 0 6px; }
.sub { margin: 0 0 24px; color: #6b7280; }
.form { display: grid; gap: 16px; }
.checkline { display: flex; align-items: center; gap: .5rem; }
.switch { margin-top: 12px; text-align: center; color: #6b7280; }
.w-full { width: 100%; }
.mt-2 { margin-top: .5rem; }
</style>
