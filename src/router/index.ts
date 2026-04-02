import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OnboardingView from '../views/OnboardingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Backstitch',
        description: 'Backstitch provides real-time version control for Godot.',
      },
    },
    {
      path: '/getting-started',
      name: 'onboarding',
      component: OnboardingView,
      meta: {
        title: 'Getting Started | Backstitch',
        description: 'Getting started with Backstitch.',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        title: '404 | Backstitch',
        description: '404: Not Found',
        robots: 'noindex, nofollow',
      },
    },
  ],
})

router.beforeEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : undefined
  document.title = title ?? 'Backstitch'
  const description = typeof to.meta.description === 'string' ? to.meta.description : undefined
  const robots = typeof to.meta.robots === 'string' ? to.meta.robots : undefined
  document.querySelector(`meta[name="description"]`)?.setAttribute('content', description ?? '')
  document.querySelector(`meta[name="robots"]`)?.setAttribute('content', robots ?? 'all')
})

export default router
