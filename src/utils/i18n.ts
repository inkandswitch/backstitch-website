// UI chrome strings used across the docs (sidebar, prev/next, etc.).
// Long-form content lives as separate markdown files per locale and is not
// translated here — only the small set of fixed UI labels.

import type { Locale } from '@/content/docs-routes'

export type Messages = {
  htmlLang: string
  tableOfContents: string
  closeMenu: string
  openMenu: string
  previousPage: string
  nextPage: string
  switchLanguage: string
}

export const messages: Record<Locale, Messages> = {
  en: {
    htmlLang: 'en',
    tableOfContents: 'Table of Contents',
    closeMenu: 'Close Menu',
    openMenu: 'Open Menu',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    switchLanguage: 'Language',
  },
  es: {
    htmlLang: 'es',
    tableOfContents: 'Tabla de contenidos',
    closeMenu: 'Cerrar menú',
    openMenu: 'Abrir menú',
    previousPage: 'Página anterior',
    nextPage: 'Página siguiente',
    switchLanguage: 'Idioma',
  },
}
