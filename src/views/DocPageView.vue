<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'
import { pages } from '@/content/docs-pages'
import path from 'path-browserify-esm'
import { useRoute } from 'vue-router'
import router from '@/router'

const md = new MarkdownIt()

const props = defineProps<{
  file: string
}>()

const route = useRoute()

function fixLink(url: string): string {
  const r = new RegExp('^(?:[a-z+]+:)?//', 'i')
  if (!r.test(url)) {
    if (url.endsWith('.md')) {
      const res = path.join(route.fullPath, url.slice(0, -3))
      return path.resolve(res)
    }
    return url
  }
  return url
}

// Simple markdown-it plugin to parse ./installation.md or whatever into a link to /docs/installation
md.use((md) => {
  md.core.ruler.push('routerlinks', (state) => {
    for (const { type, children } of state.tokens) {
      if (type !== 'inline') continue
      if (!children) continue
      for (const child of children) {
        if (child.type !== 'link_open') continue

        child.attrSet('href', fixLink(child.attrGet('href') || '#'))
      }
    }
  })
})

const html = computed(() => {
  const page = pages[props.file]!
  console.log(page)
  return md.render(page.content)
})

// intercept anchor tags into a fake router-link
function click(e: MouseEvent) {
  if (e.target instanceof HTMLAnchorElement) {
    router.push(new URL(e.target.href).pathname)
    e.preventDefault()
  }
}
</script>

<template>
  <div @click="click" v-html="html"></div>
</template>
