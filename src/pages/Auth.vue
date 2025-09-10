<template>
  <component :is="isLogin ? LoginPage : RegisterPage" />
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

// 쿼리에서 직접 파생 (watch 불필요)
const route = useRoute()
const isLogin = computed(() => route.query.type === 'login')

// 코드 스플리팅
const LoginPage = defineAsyncComponent(() => import('@/pages/auth/Login.vue'))
const RegisterPage = defineAsyncComponent(() => import('@/pages/auth/Register.vue'))
</script>
