// This file owns the docs structure across locales. The high-level shape is:
//   - `pageTrees` is a per-locale sidebar/page tree. Each locale's tree mirrors
//     the same `route` slugs so the language switcher can swap a locale segment
//     and land on the equivalent page.
//   - `pages` is a flat lookup keyed by markdown file path. It carries the
//     fully-resolved URL for that page plus its locale and locale-independent
//     slug path, both of which power routing, the switcher, and SEO tags.

export type Locale = 'en' | 'es'

export const SUPPORTED_LOCALES: Locale[] = ['en', 'es']
export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
}

export type Doc = {
  name: string
  file: string
  route: string
  children?: Doc[]
}

export const pageTrees: Record<Locale, Doc[]> = {
  en: [
    {
      name: 'Welcome to Backstitch!',
      file: './docs/en/introduction.md',
      route: '',
    },
    {
      name: 'Installation',
      file: './docs/en/installation/index.md',
      route: 'installation',
      children: [
        {
          name: 'Demo Project',
          file: './docs/en/installation/demo-project.md',
          route: 'demo-project',
        },
        {
          name: 'Quick Start',
          file: './docs/en/installation/launcher.md',
          route: 'launcher',
        },
        {
          name: 'Manual Setup',
          file: './docs/en/installation/manual-setup.md',
          route: 'manual-setup',
        },
      ],
    },
    {
      name: 'Server Setup',
      file: './docs/en/server/index.md',
      route: 'server',
      children: [
        {
          name: 'Alpha Test Server',
          file: './docs/en/server/alpha-server.md',
          route: 'alpha-server',
        },
        {
          name: 'Host a Server',
          file: './docs/en/server/host.md',
          route: 'host',
        },
      ],
    },
    {
      name: 'Tutorial',
      file: './docs/en/tutorial/index.md',
      route: 'tutorial',
      children: [
        {
          name: 'Project Setup',
          file: './docs/en/tutorial/project-setup.md',
          route: 'project-setup',
        },
        {
          name: 'Share Your Project',
          file: './docs/en/tutorial/sharing.md',
          route: 'sharing',
        },
        {
          name: 'Making Changes',
          file: './docs/en/tutorial/making-changes.md',
          route: 'making-changes',
        },
        {
          name: 'Branch and Merge',
          file: './docs/en/tutorial/branches.md',
          route: 'branches',
        },
        {
          name: 'Reverting Changes',
          file: './docs/en/tutorial/revert.md',
          route: 'revert',
        },
      ],
    },
    {
      name: 'Troubleshooting',
      file: './docs/en/troubleshooting.md',
      route: 'troubleshooting',
    },
  ],
  es: [
    {
      name: '¡Bienvenido a Backstitch!',
      file: './docs/es/introduction.md',
      route: '',
    },
    {
      name: 'Instalación',
      file: './docs/es/installation/index.md',
      route: 'installation',
      children: [
        {
          name: 'Proyecto de demostración',
          file: './docs/es/installation/demo-project.md',
          route: 'demo-project',
        },
        {
          name: 'Inicio rápido',
          file: './docs/es/installation/launcher.md',
          route: 'launcher',
        },
        {
          name: 'Configuración manual',
          file: './docs/es/installation/manual-setup.md',
          route: 'manual-setup',
        },
      ],
    },
    {
      name: 'Configuración del servidor',
      file: './docs/es/server/index.md',
      route: 'server',
      children: [
        {
          name: 'Servidor de pruebas alfa',
          file: './docs/es/server/alpha-server.md',
          route: 'alpha-server',
        },
        {
          name: 'Hospedar un servidor',
          file: './docs/es/server/host.md',
          route: 'host',
        },
      ],
    },
    {
      name: 'Tutorial',
      file: './docs/es/tutorial/index.md',
      route: 'tutorial',
      children: [
        {
          name: 'Configuración del proyecto',
          file: './docs/es/tutorial/project-setup.md',
          route: 'project-setup',
        },
        {
          name: 'Comparte tu proyecto',
          file: './docs/es/tutorial/sharing.md',
          route: 'sharing',
        },
        {
          name: 'Realizar cambios',
          file: './docs/es/tutorial/making-changes.md',
          route: 'making-changes',
        },
        {
          name: 'Ramificar y fusionar',
          file: './docs/es/tutorial/branches.md',
          route: 'branches',
        },
        {
          name: 'Revertir cambios',
          file: './docs/es/tutorial/revert.md',
          route: 'revert',
        },
      ],
    },
    {
      name: 'Solución de problemas',
      file: './docs/es/troubleshooting.md',
      route: 'troubleshooting',
    },
  ],
}

export type Page = {
  content?: string
  route: string
  name: string
  locale: Locale
  slugPath: string
}

// Insertion order matters: it powers prev/next page navigation in DocPageView.
export const pages = new Map<string, Page>()

// Returns the URL prefix used for a locale. The default locale is unprefixed
// (e.g. `/docs`), all others are nested under their locale code (`/docs/es`).
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/docs' : `/docs/${locale}`
}

// Returns the URL of `slugPath` (e.g. `/installation/launcher`) in `locale`.
// Pass an empty slug to land on the locale's docs root.
export function localizedRoute(locale: Locale, slugPath: string): string {
  const prefix = localePrefix(locale)
  return slugPath ? `${prefix}${slugPath}` : `${prefix}/`
}

function flattenPagetree(locale: Locale, tree: Doc[], parentSlug: string) {
  for (const doc of tree) {
    const slugPath = parentSlug + '/' + doc.route
    pages.set(doc.file, {
      route: localizedRoute(locale, slugPath),
      name: doc.name,
      locale,
      slugPath,
    })
    if (doc.children) flattenPagetree(locale, doc.children, slugPath)
  }
}

for (const locale of SUPPORTED_LOCALES) {
  flattenPagetree(locale, pageTrees[locale], '')
}
