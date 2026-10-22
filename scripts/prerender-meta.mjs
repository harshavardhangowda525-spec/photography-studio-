/**
 * Post-build step: writes a static HTML entry per route (dist/work/index.html, …) with
 * that route's own <title>, description, canonical and Open Graph tags, so crawlers and
 * link previews see correct metadata without running JavaScript. Also emits dist/404.html.
 * Route metadata lives in src/config/seo.json (shared with the runtime useSeo hook).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const seo = JSON.parse(await readFile(join(root, 'src/config/seo.json'), 'utf8'))
const template = await readFile(join(dist, 'index.html'), 'utf8')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function render(path, { title, description }, { noindex = false } = {}) {
  const url = `${seo.siteUrl}${path}`
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`)

  // Drop resources that only the matching route needs (e.g. the home hero preload).
  html = html.replace(/\s*<!--[^>]*data-route-only[^>]*-->/g, '')
  html = html.replace(/\s*<link data-route-only="([^"]*)"[^>]*\/>/g, (tag, only) => (only === path ? tag : ''))

  if (noindex) {
    html = html
      .replace(/(<meta name="robots" content=")[^"]*(")/, '$1noindex, follow$2')
      .replace(/\s*<link rel="canonical"[^>]*>/, '')
  }
  return html
}

// Preview builds (e.g. GitHub Pages) set VITE_NOINDEX=true so they aren't indexed as a duplicate of the real domain.
const previewBuild = process.env.VITE_NOINDEX === 'true'

for (const [path, meta] of Object.entries(seo.routes)) {
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, render(path, meta, { noindex: previewBuild }))
  console.log(`  ✓ ${path.padEnd(10)} → ${file.replace(root + '/', '')}`)
}

await writeFile(
  join(dist, '404.html'),
  render('/404', { title: 'Page not found | Rule Of Thirds', description: 'The page you were looking for could not be found.' }, { noindex: true }),
)
console.log('  ✓ 404        → dist/404.html')
