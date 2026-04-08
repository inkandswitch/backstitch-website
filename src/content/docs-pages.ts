export type Doc = {
  name: string
  file: string
  route: string
  children?: Doc[]
}

export const pageTree: Doc[] = [
  {
    name: 'Welcome to Backstitch!',
    file: './docs/introduction.md',
    route: '',
  },
  {
    name: 'Installation',
    file: './docs/installation/index.md',
    route: 'installation',
    children: [
      {
        name: 'Demo Project',
        file: './docs/installation/demo-project.md',
        route: 'demo-project',
      },
      {
        name: 'Quick Start',
        file: './docs/installation/launcher.md',
        route: 'launcher',
      },
      {
        name: 'Manual Setup',
        file: './docs/installation/manual-setup.md',
        route: 'manual-setup',
      },
    ],
  },
  {
    name: 'Server Setup',
    file: './docs/server/index.md',
    route: 'server',
    children: [
      {
        name: 'Alpha Test Server',
        file: './docs/server/alpha-server.md',
        route: 'alpha-server',
      },
      {
        name: 'Host a Server',
        file: './docs/server/host.md',
        route: 'host',
      },
    ],
  },
  {
    name: 'Tutorial',
    file: './docs/tutorial/index.md',
    route: 'tutorial',
    children: [
      {
        name: 'Project Setup',
        file: './docs/tutorial/project-setup.md',
        route: 'project-setup',
      },
      {
        name: 'Share Your Project',
        file: './docs/tutorial/sharing.md',
        route: 'sharing',
      },
      {
        name: 'Making Changes',
        file: './docs/tutorial/making-changes.md',
        route: 'making-changes',
      },
      {
        name: 'Branch and Merge',
        file: './docs/tutorial/branches.md',
        route: 'branches',
      },
      {
        name: 'Reverting Changes',
        file: './docs/tutorial/revert.md',
        route: 'revert',
      },
    ],
  },
  {
    name: 'Troubleshooting',
    file: './docs/troubleshooting.md',
    route: 'troubleshooting',
  },
]

type Page = {
  content: string
  route: string
  name: string
}

export const pages = new Map<string, Page>()

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

function flattenPagetree(tree: Doc[], route: string) {
  for (const page of tree) {
    pages.set(page.file, {
      content: content['/src/content' + page.file.slice(1)]!,
      route: route + '/' + page.route,
      name: page.name,
    })
    if (page.children) flattenPagetree(page.children, route + '/' + page.route)
  }
}

flattenPagetree(pageTree, '/docs')
