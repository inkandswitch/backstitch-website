import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DocsView from '../views/DocsView.vue'
import { pageTree, type Doc } from '@/content/docs-routes'
import DocPageView from '@/views/DocPageView.vue'

function generateDocsRoutes(docs: Doc[]) {
  const docsRoutes: RouteRecordRaw[] = []
  function generate(docs: Doc[], route: string) {
    for (const doc of docs) {
      docsRoutes.push({
        path: route + '/' + doc.route,
        name: doc.name,
        component: DocPageView,
        props: {
          file: doc.file,
        },
        meta: {
          title: doc.name + ' | Backstitch',
        },
      })
      if (doc.children) generate(doc.children, route + '/' + doc.route)
    }
  }
  generate(docs, '/docs')

  return docsRoutes
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Backstitch',
        description:
          'Backstitch: A Godot plugin that enables fast collaboration for dev teams, game jams, and classrooms.',
      },
    },
    {
      path: '/docs',
      name: 'docs',
      component: DocsView,
      children: generateDocsRoutes(pageTree),
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
