import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'
import netlifyRedirects from './src/vite-plugins/netlify-redirects.ts'
import { pages } from './src/content/docs-routes.ts'
import sitemap from 'vite-plugin-sitemap'

// collect routes
const routes = []
for (const [_, page] of pages) {
  routes.push(page.route)
}

routes.push('/')

const appendRules = [
  'http://backstitch-website.netlify.app/* https://backstitch.dev/:splat 301!',
  'https://backstitch-website.netlify.app/* https://backstitch.dev/:splat 301!',
  '/* /index.html 404',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    imagetools(),
    netlifyRedirects(routes, appendRules),
    sitemap({ dynamicRoutes: routes, hostname: 'https://backstitch.dev' }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.md': 'text',
      },
    },
  },
})
