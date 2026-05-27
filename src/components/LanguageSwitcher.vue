<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {
  SUPPORTED_LOCALES,
  LOCALE_LABELS,
  localizedRoute,
  type Locale,
} from '@/content/docs-routes'
import { useLocale } from '@/utils/use-locale'

const PREFERRED_LOCALE_KEY = 'preferred-locale'

const route = useRoute()
const router = useRouter()
const { locale, t } = useLocale()

function switchTo(target: Locale) {
  if (target === locale.value) return
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(PREFERRED_LOCALE_KEY, target)
    } catch {
      // localStorage may be unavailable (private mode, SSR); ignore.
    }
  }
  const slug = typeof route.meta?.slugPath === 'string' ? route.meta.slugPath : ''
  router.push(localizedRoute(target, slug))
}
</script>

<template>
  <div class="lang-switcher" role="group" :aria-label="t.switchLanguage">
    <button
      v-for="l in SUPPORTED_LOCALES"
      :key="l"
      :aria-current="l === locale ? 'true' : undefined"
      :aria-label="LOCALE_LABELS[l]"
      :title="LOCALE_LABELS[l]"
      class="lang-button"
      :class="{ active: l === locale }"
      @click="switchTo(l)"
    >
      {{ l.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: inline-flex;
  border: 2px solid var(--color-primary-800);
  border-radius: 0.5rem;
  overflow: hidden;
  font-size: 0.85rem;
  line-height: 1;
}

.lang-button {
  padding: 0.35rem 0.6rem;
  background: transparent;
  color: var(--color-primary-500);
  cursor: pointer;
  border: none;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.lang-button + .lang-button {
  border-left: 2px solid var(--color-primary-800);
}

.lang-button.active {
  background: var(--color-primary-800);
  color: var(--color-neutral-200);
}

.lang-button:hover:not(.active) {
  background: rgba(0, 0, 0, 0.2);
}
</style>
