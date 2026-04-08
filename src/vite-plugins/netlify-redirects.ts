import { type Plugin } from 'vite'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

function convertToNetlifyPath(route: string) {
  // handle :slugs
  if (route.includes(':')) {
    return route.replace(/:\w+/g, '*')
  }
  return route
}

export default function netlifyRedirectsPlugin(routes: string[]): Plugin {
  return {
    name: 'netlify-redirects-generator',
    apply: 'build',

    generateBundle(_, bundle) {
      const redirects = []

      routes.forEach((route) => {
        const netlifyPath = convertToNetlifyPath(route)

        // always direct to index.html
        redirects.push(`${netlifyPath} /index.html 200`)
      })

      // redirect anything else to 404 with a real status code
      redirects.push(`/* /index.html 404`)

      const output = redirects.join('\n')

      const outDir = Object.keys(bundle)[0]
        ? resolve(process.cwd(), 'dist/_redirects')
        : resolve(process.cwd(), 'dist/_redirects')

      writeFileSync(outDir, output)
    },
  }
}
