import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DocsView from '../views/DocsView.vue'
import {
  pageTrees,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  localePrefix,
  localizedRoute,
  type Doc,
  type Locale,
} from '@/content/docs-routes'
import { messages } from '@/utils/i18n'
import DocPageView from '@/views/DocPageView.vue'

function generateDocsRoutes(): RouteRecordRaw[] {
  const out: RouteRecordRaw[] = []
  for (const locale of SUPPORTED_LOCALES) {
    walk(out, pageTrees[locale], localePrefix(locale), '', locale)
  }
  return out
}

function walk(
  out: RouteRecordRaw[],
  docs: Doc[],
  parentPath: string,
  parentSlug: string,
  locale: Locale,
) {
  for (const doc of docs) {
    const fullPath = parentPath + '/' + doc.route
    const slugPath = parentSlug + '/' + doc.route
    out.push({
      path: fullPath,
      name: `${locale}:${slugPath}`,
      component: DocPageView,
      props: { file: doc.file },
      meta: {
        title: doc.name + ' | Backstitch',
        locale,
        slugPath,
      },
    })
    if (doc.children) walk(out, doc.children, fullPath, slugPath, locale)
  }
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
      children: generateDocsRoutes(),
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

  const locale = (typeof to.meta.locale === 'string' ? to.meta.locale : DEFAULT_LOCALE) as Locale
  document.documentElement.lang = messages[locale]?.htmlLang ?? locale

  // Emit hreflang alternates and a canonical URL for docs pages so search
  // engines can pick the right localized version. We rebuild these on every
  // navigation rather than mutating the static index.html.
  const slugPath = typeof to.meta.slugPath === 'string' ? to.meta.slugPath : null
  syncLocaleLinks(slugPath)
})

const ALTERNATE_LINK_MARK = 'data-i18n-alt'

function syncLocaleLinks(slugPath: string | null) {
  document.head.querySelectorAll(`link[${ALTERNATE_LINK_MARK}]`).forEach((el) => el.remove())
  if (slugPath == null) return

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  for (const locale of SUPPORTED_LOCALES) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'alternate')
    link.setAttribute('hreflang', locale)
    link.setAttribute('href', origin + localizedRoute(locale, slugPath))
    link.setAttribute(ALTERNATE_LINK_MARK, '')
    document.head.appendChild(link)
  }

  const xDefault = document.createElement('link')
  xDefault.setAttribute('rel', 'alternate')
  xDefault.setAttribute('hreflang', 'x-default')
  xDefault.setAttribute('href', origin + localizedRoute(DEFAULT_LOCALE, slugPath))
  xDefault.setAttribute(ALTERNATE_LINK_MARK, '')
  document.head.appendChild(xDefault)
}

export default router
