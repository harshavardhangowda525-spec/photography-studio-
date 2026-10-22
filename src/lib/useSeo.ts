import { useEffect } from 'react'
import seo from '../config/seo.json'

type RouteKey = keyof typeof seo.routes

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

/**
 * Keeps <title>, description, canonical and Open Graph tags in sync on client-side navigation.
 * The same values are written into each route's static HTML at build time (scripts/prerender-meta.mjs).
 */
export function useSeo(route: RouteKey | { title: string; description: string; path: string; noindex?: boolean }) {
  useEffect(() => {
    const meta = typeof route === 'string' ? { ...seo.routes[route], path: route, noindex: false } : route
    const url = `${seo.siteUrl}${meta.path === '/' ? '/' : meta.path}`
    document.title = meta.title
    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[name="twitter:title"]', 'content', meta.title)
    setMeta('meta[name="twitter:description"]', 'content', meta.description)
    setMeta('meta[name="robots"]', 'content', meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
  }, [route])
}
