import { AnimatePresence, m } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { categoryLabel, type PortfolioItem } from '../../content/portfolio'
import { ease } from '../../motion/presets'
import { PlaceholderTag } from '../ui/PlaceholderTag'

interface LightboxProps {
  items: PortfolioItem[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

const SWIPE_THRESHOLD = 50

/**
 * Accessible, immersive viewer:
 *  - Esc closes, ←/→ navigate, focus is trapped and restored to the opener
 *  - swipe left/right on touch devices
 *  - films play with native controls, never autoplay with sound
 */
export function Lightbox({ items, index, onClose, onIndexChange }: LightboxProps) {
  const open = index !== null && items[index] !== undefined
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [direction, setDirection] = useState(0)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const go = useCallback(
    (delta: number) => {
      if (index === null || items.length < 2) return
      setDirection(delta)
      onIndexChange((index + delta + items.length) % items.length)
    },
    [index, items.length, onIndexChange],
  )

  // Focus management, scroll lock and keyboard controls.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = prevOverflow
      opener?.focus?.({ preventScroll: true })
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowRight') {
        if ((e.target as HTMLElement).tagName === 'VIDEO') return
        go(1)
      } else if (e.key === 'ArrowLeft') {
        if ((e.target as HTMLElement).tagName === 'VIDEO') return
        go(-1)
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusables = [
          ...dialogRef.current.querySelectorAll<HTMLElement>('button, video[controls], a[href]'),
        ].filter((el) => !el.hasAttribute('disabled') && el.getClientRects().length > 0)
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, go, onClose])

  // Warm the cache for neighbours so stepping through feels instant.
  useEffect(() => {
    if (index === null || items.length < 2) return
    for (const d of [1, -1]) {
      const n = items[(index + d + items.length) % items.length]
      const img = new Image()
      img.src = n.image.src
    }
  }, [index, items])

  const item = open ? items[index!] : null

  return createPortal(
    <AnimatePresence>
      {item && (
        <m.div
          ref={dialogRef}
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} — image ${index! + 1} of ${items.length}`}
          className="grain fixed inset-0 z-[90] flex flex-col bg-ink/[0.97] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, ease: ease.cinema } }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: ease.soft } }}
          onTouchStart={(e) => {
            const t = e.touches[0]
            touchStart.current = { x: t.clientX, y: t.clientY }
          }}
          onTouchEnd={(e) => {
            const s = touchStart.current
            touchStart.current = null
            if (!s) return
            const t = e.changedTouches[0]
            const dx = t.clientX - s.x
            const dy = t.clientY - s.y
            if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1)
            else if (dy > 110 && Math.abs(dy) > Math.abs(dx) * 1.6) onClose()
          }}
        >
          {/* Top bar */}
          <div className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-8">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-mute" aria-live="polite">
              <span className="text-ivory">{String(index! + 1).padStart(2, '0')}</span>
              <span className="mx-2 text-gold">/</span>
              {String(items.length).padStart(2, '0')}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="group flex min-h-11 items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ivory/80 hover:text-ivory"
            >
              Close
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors group-hover:border-gold">
                <X size={18} strokeWidth={1.5} aria-hidden="true" />
              </span>
            </button>
          </div>

          {/* Stage */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20 lg:px-28">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <m.figure
                key={item.id}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 0.98 }),
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.98 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: ease.cinema }}
                className="relative flex h-full max-h-full w-full flex-col items-center justify-center"
              >
                <div className="relative max-h-[calc(100svh-18rem)] sm:max-h-[calc(100svh-13rem)]">
                  {item.video ? (
                    <video
                      key={item.id}
                      controls
                      playsInline
                      preload="metadata"
                      poster={item.image.src}
                      className="max-h-[calc(100svh-18rem)] sm:max-h-[calc(100svh-13rem)] w-auto max-w-full bg-black shadow-2xl"
                      width={item.image.width}
                      height={item.image.height}
                      aria-label={item.alt}
                    >
                      {item.video.map((s) => (
                        <source key={s.src} src={s.src} type={s.type} />
                      ))}
                      Your browser can&rsquo;t play this film.
                    </video>
                  ) : (
                    <img
                      src={item.image.src}
                      srcSet={item.image.srcSet}
                      sizes="(min-width: 1024px) 80vw, 100vw"
                      width={item.image.width}
                      height={item.image.height}
                      alt={item.alt}
                      className="max-h-[calc(100svh-18rem)] sm:max-h-[calc(100svh-13rem)] w-auto max-w-full object-contain shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]"
                      draggable={false}
                    />
                  )}
                  {item.image.placeholder && <PlaceholderTag className="absolute left-3 top-3" />}
                </div>
                <figcaption className="mt-5 max-w-2xl px-2 text-center">
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-gold">
                    {categoryLabel(item.category, true)}
                  </span>
                  <span className="mt-2 block font-serif text-2xl text-ivory md:text-3xl">{item.title}</span>
                  {item.caption && <span className="mt-1 block text-sm text-mute">{item.caption}</span>}
                </figcaption>
              </m.figure>
            </AnimatePresence>

            {items.length > 1 && (
              <>
                <NavButton side="left" onClick={() => go(-1)} />
                <NavButton side="right" onClick={() => go(1)} />
              </>
            )}
          </div>
          {items.length > 1 && (
            <div className="flex items-center justify-between px-4 pb-5 sm:hidden">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ivory"
              >
                <ChevronLeft size={20} strokeWidth={1.25} aria-hidden="true" />
              </button>
              <p className="text-[0.6rem] uppercase tracking-[0.24em] text-mute/70">Swipe to browse</p>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ivory"
              >
                <ChevronRight size={20} strokeWidth={1.25} aria-hidden="true" />
              </button>
            </div>
          )}
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous image' : 'Next image'}
      className={`absolute top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink/40 text-ivory backdrop-blur transition-colors duration-300 hover:border-gold hover:text-gold sm:flex ${
        side === 'left' ? 'left-4 lg:left-8' : 'right-4 lg:right-8'
      }`}
    >
      <Icon size={22} strokeWidth={1.25} aria-hidden="true" />
    </button>
  )
}
