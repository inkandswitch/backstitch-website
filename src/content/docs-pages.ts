// This file handles populating the routes from docs-routes with content.

import { pages } from './docs-routes'

export type ImageMetadata = {
  width: number
  height: number
}

const content = import.meta.glob<string>('/src/content/docs/**/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

// image width is calculated from CSS max-width; if that changes, change this.
// may look blurry on highdpi screens or zoom
export const images = import.meta.glob<string>('/src/content/docs/**/*.png', {
  eager: true,
  import: 'default',
  query: {
    format: 'webp',
    w: 480,
  },
})

export const imageMetadata = import.meta.glob<ImageMetadata>('/src/content/docs/**/*.png', {
  eager: true,
  import: 'default',
  query: {
    format: 'webp',
    w: '480',
    as: 'meta:width;height',
  },
})

// set the content (we do this at runtime; Vite can't do this obviously)
for (const [file, page] of pages) {
  page.content = content['/src/content' + file.slice(1)]!
}

export { pages }
