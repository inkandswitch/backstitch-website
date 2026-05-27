<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView } from 'vue-router'
import { pageTrees, localePrefix } from '@/content/docs-routes'
import TocItem from '@/components/TocItem.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import { useLocale } from '@/utils/use-locale'
import router from '@/router'

const expanded = ref(false)
const { locale, t } = useLocale()

const tree = computed(() => pageTrees[locale.value])
const parentRoute = computed(() => localePrefix(locale.value))

router.beforeEach(() => {
  expanded.value = false
})
</script>

<template>
  <div
    class="flex sm:flex-row sm:pointer-events-auto flex-col content-box grow self-stretch w-full"
    :class="{ expanded }"
  >
    <aside class="invisible sm:visible self-stretch shrink-0 bg-mauve-900">
      <div
        class="sm:hidden flex justify-between items-center text-lg border-dashed border-b-2 mb-3 border-primary-800"
      >
        {{ t.tableOfContents }}
        <button
          :aria-label="t.closeMenu"
          class="toc-close-button inline-block w-10 p-1 fill-primary-800 self-end"
          @click="expanded = !expanded"
        >
          <CloseIcon />
        </button>
      </div>
      <div class="hidden sm:flex justify-end mb-3">
        <LanguageSwitcher />
      </div>
      <div class="sm:hidden mb-3">
        <LanguageSwitcher />
      </div>
      <ul>
        <TocItem
          :doc="doc"
          :parent-route="parentRoute"
          v-for="(doc, index) in tree"
          :key="`${locale}-${index}`"
        />
      </ul>
    </aside>
    <button
      class="toc-button sm:hidden text-primary-500 border-primary-500 border-2 rounded-lg px-3 py-1 mb-4 self-start"
      @click="expanded = true"
    >
      {{ t.tableOfContents }}
    </button>
    <div
      class="sm:block hidden self-stretch w-0 pr-8 mr-8 my-12 border-r-2 border-dashed border-primary-800"
    ></div>
    <section class="text-content grow docs">
      <RouterView />
    </section>
  </div>
</template>

<style scoped>
@media (width < 40rem /* 640px */) {
  aside {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    padding: 1rem 2rem 1rem 0;
    overflow: auto;
    visibility: visbile;
    pointer-events: none;
  }
  .expanded aside {
    visibility: visible;
    pointer-events: auto;
  }
}
.expanded .toc-button {
  display: none;
}
</style>
