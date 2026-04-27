import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/onboarding'
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('@/views/OnboardingView.vue'),
    meta: { title: '画像采集' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: '学习仪表盘' }
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () => import('@/views/WorkspaceView.vue'),
    meta: { title: '学习工坊' },
    props: (route) => ({ nodeId: route.query.nodeId })
  },
  {
    path: '/assessment',
    name: 'assessment',
    component: () => import('@/views/AssessmentView.vue'),
    meta: { title: '评估中心' }
  },
  {
    path: '/skill-lab',
    name: 'skill-lab',
    component: () => import('@/views/SkillLabView.vue'),
    meta: { title: 'Skill工坊' }
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('@/views/MessagesView.vue'),
    meta: { title: '消息中心' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  document.title = `${to.meta.title || '智学脑'} - AIBrain`
})

export default router
