import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'
import netlifyRedirects from './src/vite-plugins/netlify-redirects.ts'
import { pages } from './src/content/docs-routes.ts'

// collect routes
const routes = []
for (const [_, page] of pages) {
  routes.push(page.route)
}

routes.push('/')

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss(), imagetools(), netlifyRedirects(routes)],
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
