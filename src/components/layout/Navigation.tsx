import { AnimatePresence, m } from 'motion/react'
import { Phone } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { business, links } from '../../config/business'
import { isNavActive, navItems } from '../../config/navigation'
import { useScrollState } from '../../lib/useScrolled'
import { ease } from '../../motion/presets'
import { ButtonLink } from '../ui/Button'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {/* A tiny rule-of-thirds grid as the brand mark */}
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="text-gold">
        <rect x="0.5" y="0.5" width="21" height="21" fill="none" stroke="currentColor" strokeOpacity="0.55" />
        <path d="M7.5 0.5v21M14.5 0.5v21M0.5 7.5h21M0.5 14.5h21" stroke="currentColor" strokeOpacity="0.55" />
        <circle cx="14.5" cy="7.5" r="1.8" fill="currentColor" />
      </svg>
      <span className="whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-ivory sm:text-[0.78rem] sm:tracking-[0.34em]">Rule Of Thirds</span>
    </span>
  )
}

export function Navigation() {
  const { pathname, hash } = useLocation()
  const { scrolled, hidden } = useScrollState()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname, hash])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,backdrop-filter] duration-700 ease-[var(--ease-cinema)] ${
          hidden && !open ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled
            ? 'border-b border-line bg-ink/80 backdrop-blur-md'
            : 'border-b border-transparent bg-gradient-to-b from-ink/60 to-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-[1600px] items-center justify-between px-5 transition-[height] duration-500 sm:px-8 lg:px-12 ${
            scrolled ? 'h-16' : 'h-20 md:h-24'
          }`}
        >
          <Link to="/" aria-label={`${business.name} — home`} className="relative z-10">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => {
              const active = isNavActive(item.to, pathname, hash)
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={`link-underline pb-1 text-[0.72rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300 hover:text-ivory ${
                      active ? 'text-ivory' : 'text-ivory/65'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ButtonLink to="/contact" variant="outline" className="!min-h-11 !px-5 !py-3">
                Book a Session
              </ButtonLink>
            </div>
            <button
              ref={toggleRef}
              type="button"
              className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-7" aria-hidden="true">
                <span
                  className={`absolute left-0 block h-px w-full bg-ivory transition-transform duration-500 ease-[var(--ease-cinema)] ${
                    open ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px bg-ivory transition-all duration-500 ease-[var(--ease-cinema)] ${
                    open ? 'top-1.5 w-full -rotate-45' : 'top-3 w-2/3'
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} toggleRef={toggleRef} />
    </>
  )
}

function MobileMenu({
  open,
  onClose,
  toggleRef,
}: {
  open: boolean
  onClose: () => void
  toggleRef: React.RefObject<HTMLButtonElement | null>
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!open) return
    const toggle = toggleRef.current
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const first = panelRef.current?.querySelector<HTMLElement>('a, button')
    first?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        // Trap focus between the panel and the toggle button.
        const focusables = [toggle, ...panelRef.current.querySelectorAll<HTMLElement>('a, button')].filter(
          Boolean,
        ) as HTMLElement[]
        const i = focusables.indexOf(document.activeElement as HTMLElement)
        const next = e.shiftKey ? (i <= 0 ? focusables.length - 1 : i - 1) : (i + 1) % focusables.length
        e.preventDefault()
        focusables[next]?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      toggle?.focus({ preventScroll: true })
    }
  }, [open, onClose, toggleRef])

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="grain fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-10 pt-28 lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: ease.cinema }}
        >
          <div aria-hidden="true" className="studio-light pointer-events-none absolute inset-0 -z-10 opacity-80" />
          <m.ul
            className="flex flex-col gap-1"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } } }}
          >
            {navItems.map((item, i) => {
              const active = isNavActive(item.to, pathname, hash)
              return (
                <m.li
                  key={item.to}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.cinema } },
                  }}
                  className="border-b border-line"
                >
                  <Link
                    to={item.to}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className="flex items-baseline gap-5 py-4 font-serif text-[2.4rem] leading-none text-ivory"
                  >
                    <span className="font-sans text-[0.65rem] tracking-[0.2em] text-gold">0{i + 1}</span>
                    {item.label}
                  </Link>
                </m.li>
              )
            })}
          </m.ul>

          <m.div
            className="mt-auto flex flex-col gap-4 pt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.6 } }}
          >
            <ButtonLink to="/contact" className="w-full">
              Book a Session
            </ButtonLink>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={links.whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 border border-line text-[0.7rem] uppercase tracking-[0.2em] text-ivory"
              >
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
              <a
                href={links.tel}
                className="flex min-h-12 items-center justify-center gap-2 border border-line text-[0.7rem] uppercase tracking-[0.2em] text-ivory"
              >
                <Phone size={15} strokeWidth={1.5} aria-hidden="true" /> Call
              </a>
            </div>
            <p className="text-sm text-mute">Kumaraswamy Layout, Bengaluru</p>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
