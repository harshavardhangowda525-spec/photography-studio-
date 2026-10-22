import { AnimatePresence, m } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { links } from '../../config/business'
import { ease } from '../../motion/presets'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { Footer } from './Footer'
import { Navigation, Wordmark } from './Navigation'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll handling for route changes:
 *  - new page, no hash  → jump to top once the old page has faded out (see onExitComplete)
 *  - same page, no hash → smooth scroll to top (e.g. clicking "Home" while on the home page)
 *  - any #hash          → scroll to the target once it has rendered
 */
function useScrollManager() {
  const { pathname, search, hash, key } = useLocation()
  const prev = useRef({ pathname, search })
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])
  useEffect(() => {
    const samePage = prev.current.pathname === pathname
    const searchOnly = samePage && prev.current.search !== search
    prev.current = { pathname, search }
    // Filters and lightbox state live in the query string — never move the page for those.
    if (searchOnly) return
    if (!hash) {
      if (samePage) window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      return
    }
    let tries = 0
    let raf = 0
    const go = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
      } else if (tries++ < 120) {
        raf = requestAnimationFrame(go)
      }
    }
    // Wait a beat so a page transition can mount the target section.
    const t = window.setTimeout(go, 60)
    return () => {
      window.clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [pathname, search, hash, key])
}

/** Restrained opening curtain: shows the wordmark briefly on first load only. */
function PageLoader() {
  const [visible, setVisible] = useState(() => !prefersReducedMotion())
  useEffect(() => {
    if (!visible) return
    const t = window.setTimeout(() => setVisible(false), 650)
    return () => window.clearTimeout(t)
  }, [visible])
  return (
    <AnimatePresence>
      {visible && (
        <m.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.9, ease: ease.cinema } }}
        >
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.cinema } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <Wordmark />
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

function FloatingWhatsApp() {
  return (
    <a
      href={links.whatsapp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Rule Of Thirds on WhatsApp (opens in a new tab)"
      className="fixed bottom-5 right-5 z-30 flex h-13 w-13 items-center justify-center rounded-full border border-gold/40 bg-ink/85 text-gold shadow-[0_10px_30px_-10px_rgb(0_0_0/0.8)] backdrop-blur transition-colors duration-300 hover:bg-gold hover:text-ink md:bottom-8 md:right-8"
    >
      <WhatsAppIcon size={22} />
    </a>
  )
}

/** Keeps rendering the route it was mounted with, so the exiting page doesn't swap content mid-fade. */
function FrozenOutlet() {
  const outlet = useOutlet()
  const [frozen] = useState(outlet)
  return frozen
}

export function Layout() {
  const { pathname, hash } = useLocation()
  useScrollManager()

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-gold focus:px-4 focus:py-3 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>
      <PageLoader />
      <Navigation />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
        }}
      >
        <m.main
          key={pathname}
          id="main"
          tabIndex={-1}
          className="outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6, ease: ease.cinema } }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: ease.soft } }}
        >
          <FrozenOutlet />
        </m.main>
      </AnimatePresence>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
