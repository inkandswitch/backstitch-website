import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/content/docs-routes'
import { messages, type Messages } from '@/utils/i18n'

// `useLocale` reads the active locale from the matched route's meta. The
// router populates `meta.locale` for every docs route in
// generateDocsRoutes; non-docs routes fall back to the default locale.
export function useLocale() {
  const route = useRoute()

  const locale = computed<Locale>(() => {
    const meta = route.meta?.locale
    if (typeof meta === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(meta)) {
      return meta as Locale
    }
    return DEFAULT_LOCALE
  })

  const t = computed<Messages>(() => messages[locale.value])

  return { locale, t }
}
