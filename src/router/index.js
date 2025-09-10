import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { 
        path: '/', 
        name: 'main', 
        component: () => import('@/pages/Main.vue'), 
        meta: { title: 'Main' } 
    },
    { 
        path: '/auth', 
        name: 'auth', 
        component: () => import('@/pages/Auth.vue'), 
        meta: { title: 'Auth' } 
    },
    { 
        path: '/post/:index', 
        name: 'post', 
        component: () => import('@/pages/Post.vue'), 
        meta: { title: 'Post' } 
    },
    { 
        path: '/stock/:id', 
        name: 'stockDetail', 
        component: () => import('@/pages/StockDetail.vue'), 
        meta: { title: 'Stock Detail' } 
    },
    {
        path: '/me',
        name: 'profile-me',
        component: () => import('@/pages/ProfilePage.vue'),
        meta: { self: true }
    },
    {
        path: '/users/:id',
        name: 'profile-user',
        component: () => import('@/pages/ProfilePage.vue')
    },
    // 잘못된 URL → 로그인으로 리다이렉트
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 페이지 이동 시 타이틀 설정
router.afterEach((to) => {
  if (to.meta?.title) document.title = to.meta.title
})

export default router
