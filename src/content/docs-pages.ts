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
    file: './docs/server-setup/index.md',
    route: 'server',
    children: [
      {
        name: 'Alpha Test Server',
        file: './docs/server-setup/alpha-server.md',
        route: 'alpha-server',
      },
      {
        name: 'Host a Server',
        file: './docs/server-setup/host.md',
        route: 'host',
      },
    ],
  },
  {
    name: 'Using Backstitch',
    file: './docs/usage/index.md',
    route: 'usage',
    children: [
      {
        name: 'Project Setup',
        file: './docs/usage/project-setup.md',
        route: 'project-setup',
      },
      {
        name: 'Share Your Project',
        file: './docs/usage/sharing.md',
        route: 'sharing',
      },
      {
        name: 'Making Changes',
        file: './docs/usage/making-changes.md',
        route: 'making-changes',
      },
      {
        name: 'Branch and Merge',
        file: './docs/usage/branches.md',
        route: 'branches',
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

export const pages: { [key: string]: Page } = {}

const content = import.meta.glob<string>('/src/content/docs/**/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

console.log('content', content)

function flattenPagetree(tree: Doc[], route: string) {
  for (const page of tree) {
    pages[page.file] = {
      content: content['/src/content' + page.file.slice(1)]!,
      route,
      name: page.name,
    }
    if (page.children) flattenPagetree(page.children, route + '/' + page.route)
  }
}

flattenPagetree(pageTree, 'docs')
