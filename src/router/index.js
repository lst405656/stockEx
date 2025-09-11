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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 } // 뒤로가기 시 위치 복원
  }
})

// 페이지 타이틀
router.afterEach((to) => {
  if (to.meta?.title) document.title = to.meta.title as string
})

export default router
