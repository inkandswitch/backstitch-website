<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'
import { pages, images, type ImageMetadata, imageMetadata } from '@/content/docs-pages'
import path from 'path-browserify-esm'
import { useRoute } from 'vue-router'
import router from '@/router'

const md = new MarkdownIt({
  html: true,
  typographer: true,
})

const props = defineProps<{
  file: string
}>()

const route = useRoute()

function isExternal(url: string) {
  const r = new RegExp('^(?:[a-z+]+:)?//', 'i')
  return r.test(url)
}

function fixLink(url: string): string {
  if (!isExternal(url)) {
    if (url.endsWith('.md')) {
      let p = url.slice(0, -3)
      if (p.endsWith('index')) {
        p = p.slice(0, -'index'.length)
      }
      const res = path.join(route.fullPath, p)
      return path.resolve(res)
    }
    return url
  }
  return url
}

function fixImage(url: string): [string, ImageMetadata] | null {
  let mdPath = ''
  for (const [thisPath, page] of pages) {
    if (path.resolve(page.route) == path.resolve(route.fullPath)) {
      mdPath = thisPath
    }
  }

  const r = new RegExp('^(?:[a-z+]+:)?//', 'i')
  if (!r.test(url)) {
    if (url.endsWith('.png')) {
      const res = path.join('/src/content', mdPath, '../', url)
      if (images[path.resolve(res)]) {
        const resolved = path.resolve(res)
        const image = images[resolved]
        const meta = imageMetadata[resolved]
        if (image == null || meta == null) return null
        return [image, meta]
      }
    }
    return null
  }
  return null
}

// Simple markdown-it plugin to parse ./installation.md or whatever into a link to /docs/installation
md.use((md) => {
  md.core.ruler.push('routerlinks', (state) => {
    for (const { type, children } of state.tokens) {
      if (type !== 'inline') continue
      if (!children) continue
      for (const child of children) {
        if (child.type === 'link_open') {
          const url = child.attrGet('href') || '#'
          child.attrSet('href', fixLink(url))
          if (isExternal(url)) {
            child.attrSet('target', '_blank')
          }
        }
        if (child.tag == 'img') {
          const res = fixImage(child.attrGet('src') || '#')
          if (res == null) continue
          const [url, meta] = res
          child.attrSet('src', url)
          child.attrSet('style', `aspect-ratio:${meta.width / meta.height}`)
        }
      }
    }
  })
})

function getIndexOfKey<K, V>(map: Map<K, V>, targetKey: K): number {
  let i = 0
  for (const key of map.keys()) {
    if (key === targetKey) return i
    i++
  }
  return -1
}

function getAtIndex<K, V>(map: Map<K, V>, index: number): V | undefined {
  let i = 0
  for (const key of map.keys()) {
    if (i == index) return map.get(key)
    i++
  }
  return undefined
}

const nextPage = computed(() => {
  const index = getIndexOfKey(pages, props.file)
  const page = getAtIndex(pages, index + 1)
  return page
})

const prevPage = computed(() => {
  const index = getIndexOfKey(pages, props.file)
  const page = getAtIndex(pages, index - 1)
  return page
})

const html = computed(() => {
  const page = pages.get(props.file)!
  return md.render(page.content ?? '')
})

// intercept anchor tags into a fake router-link
function click(e: MouseEvent) {
  if (e.target instanceof HTMLAnchorElement) {
    if (isExternal(e.target.getAttribute('href') ?? '')) return
    router.push(new URL(e.target.href).pathname)
    e.preventDefault()
  }
}
</script>

<template>
  <div class="flex flex-col justify-between h-full gap-8">
    <div @click="click" v-html="html"></div>
    <div class="flex flex-col sm:flex-row gap-4">
      <div v-if="prevPage" class="w-full sm:w-[calc(50%-1rem)] mr-auto">
        <router-link
          :to="prevPage.route"
          class="button block w-full h-full no-underline text-secondary-500 border-secondary-500"
        >
          <div class="text-base">Previous page</div>
          <div class="text-xl text-neutral-200">{{ prevPage.name }}</div>
        </router-link>
      </div>
      <div v-if="nextPage" class="w-full ml-auto sm:w-[calc(50%-1rem)]">
        <router-link
          :to="nextPage.route"
          class="button block w-full h-full no-underline text-primary-700 border-primary-600"
        >
          <div class="text-base">Next page</div>
          <div class="text-xl text-neutral-200">{{ nextPage.name }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>
