import { AnimatePresence, m } from 'motion/react'
import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Lightbox } from '../components/portfolio/Lightbox'
import { PortfolioTile } from '../components/portfolio/PortfolioTile'
import { ButtonLink } from '../components/ui/Button'
import { PlaceholderTag } from '../components/ui/PlaceholderTag'
import { categories, categoryLabel, portfolio, type CategoryId } from '../content/portfolio'
import { useSeo } from '../lib/useSeo'
import { ease } from '../motion/presets'
import { Reveal } from '../motion/Reveal'
import { SplitLines } from '../motion/SplitLines'

const isCategory = (v: string | null): v is CategoryId => categories.some((c) => c.id === v)

export default function Work() {
  useSeo('/work')
  const [params, setParams] = useSearchParams()
  const raw = params.get('category')
  const category = isCategory(raw) ? raw : 'all'
  const itemId = params.get('item')

  const filtered = useMemo(
    () => (category === 'all' ? portfolio : portfolio.filter((p) => p.category === category)),
    [category],
  )
  const films = portfolio.filter((p) => p.video)

  // The lightbox browses the current filter; a shared link to an item outside it falls back to everything.
  const lightboxItems = itemId && !filtered.some((p) => p.id === itemId) ? portfolio : filtered
  const lightboxIndex = itemId ? lightboxItems.findIndex((p) => p.id === itemId) : -1

  const setCategory = (id: CategoryId | 'all') => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    next.delete('item')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  // Opening pushes a history entry (so Back closes the viewer and links are shareable);
  // closing pops it again instead of stacking duplicates.
  const navigate = useNavigate()
  const pushed = useRef(false)
  useEffect(() => {
    if (!itemId) pushed.current = false
  }, [itemId])

  const openItem = (id: string) => {
    const next = new URLSearchParams(params)
    next.set('item', id)
    pushed.current = true
    setParams(next, { preventScrollReset: true })
  }
  const showIndex = (i: number) => {
    const next = new URLSearchParams(params)
    next.set('item', lightboxItems[i].id)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const close = () => {
    if (pushed.current) {
      pushed.current = false
      navigate(-1)
      return
    }
    const next = new URLSearchParams(params)
    next.delete('item')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const counts = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, portfolio.filter((p) => p.category === c.id).length])),
    [],
  )

  return (
    <>
      {/* Header */}
      <section aria-labelledby="work-page-title" className="studio-light grain relative overflow-hidden pb-14 pt-36 md:pb-20 md:pt-48">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <Reveal as="p" className="eyebrow mb-6 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
            Our work
          </Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8" id="work-page-title">
              <SplitLines
                as="h1"
                immediate
                delay={0.2}
                lines={['Moments, performances', '& the people in them.']}
                italic={[1]}
                className="text-[clamp(2.8rem,1.6rem+5vw,7rem)] leading-[0.98]"
              />
            </div>
            <Reveal as="p" delay={0.5} className="max-w-md text-base leading-relaxed text-mute lg:col-span-4 lg:text-lg">
              Event, dance, Arangetram, concert, portrait and film work from Bengaluru — photographed and filmed with an
              eye for composition and feeling.
            </Reveal>
          </div>
          <p className="mt-10 max-w-2xl border-l border-gold/40 pl-4 text-xs leading-relaxed text-mute">
            The images currently shown are generated placeholders that illustrate the layout. They will be replaced with
            Rule Of Thirds&rsquo; own photography and films.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-20 border-y border-line bg-ink/85 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div role="group" aria-label="Filter by category" className="-mx-1 flex gap-1 overflow-x-auto py-3 [scrollbar-width:none]">
            {[{ id: 'all' as const, label: 'All work' }, ...categories].map((c) => {
              const active = category === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(c.id)}
                  className={`relative min-h-11 shrink-0 px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 ease-[var(--ease-cinema)] ${
                    active ? 'bg-gold text-ink' : 'text-ivory/65 hover:bg-ivory/5 hover:text-ivory'
                  }`}
                >
                  <span className="relative z-10">
                    {c.label}{' '}
                    <span className={`ml-1.5 ${active ? 'text-ink/80' : 'text-mute'}`}>
                      {c.id === 'all' ? portfolio.length : counts[c.id]}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Photography — masonry */}
      <section aria-labelledby="gallery-title" className="bg-ink py-14 md:py-20">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <h2 id="gallery-title" className="sr-only">
            {category === 'all' ? 'All work' : categoryLabel(category, true)}
          </h2>
          <p className="sr-only" aria-live="polite">
            Showing {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <m.ul
              key={category}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.cinema } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="columns-1 gap-5 sm:columns-2 lg:columns-3 lg:gap-7"
            >
              {filtered.map((item, i) => (
                <m.li
                  key={item.id}
                  className="mb-5 break-inside-avoid lg:mb-7"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                  transition={{ duration: 0.9, ease: ease.cinema, delay: (i % 3) * 0.08 }}
                >
                  <PortfolioTile
                    item={item}
                    onOpen={() => openItem(item.id)}
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 100vw"
                  />
                </m.li>
              ))}
            </m.ul>
          </AnimatePresence>
        </div>
      </section>

      {/* Videography */}
      {films.length > 0 && (
        <section aria-labelledby="films-title" className="paper py-24 md:py-32">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Reveal as="p" className="eyebrow mb-6 flex items-center gap-4">
                  <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
                  Videography
                </Reveal>
                <div id="films-title">
                  <SplitLines lines={['Films that', 'move with you.']} italic={[1]} className="text-h2" />
                </div>
                <Reveal as="p" className="mt-6 max-w-sm leading-relaxed text-mute">
                  Event films, performance coverage and cinematic edits. Press play — sound is always off until you choose.
                </Reveal>
              </div>
              <div className="space-y-12 lg:col-span-8">
                {films.map((f) => (
                  <Reveal as="figure" key={f.id}>
                    <div className="frame">
                      <div className="relative overflow-hidden bg-black">
                        <video
                          controls
                          playsInline
                          muted
                          preload="none"
                          poster={f.image.src}
                          width={f.image.width}
                          height={f.image.height}
                          className="aspect-video h-auto w-full"
                          aria-label={f.alt}
                        >
                          {f.video!.map((s) => (
                            <source key={s.src} src={s.src} type={s.type} />
                          ))}
                          Your browser can&rsquo;t play this film.
                        </video>
                        {f.image.placeholder && <PlaceholderTag className="absolute left-3 top-3" />}
                      </div>
                    </div>
                    <figcaption className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
                      <span className="font-serif text-2xl text-ivory">{f.title}</span>
                      {f.caption && <span className="text-sm text-mute">{f.caption}</span>}
                    </figcaption>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Closing link */}
      <section className="bg-ink py-24 text-center md:py-32">
        <div className="mx-auto max-w-3xl px-5">
          <SplitLines lines={['Have a story in mind?']} className="text-h2" />
          <Reveal className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <ButtonLink to="/contact">Start a conversation</ButtonLink>
            <ButtonLink to="/#services" variant="outline">
              See our services
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <Lightbox
        items={lightboxItems}
        index={lightboxIndex >= 0 ? lightboxIndex : null}
        onClose={close}
        onIndexChange={showIndex}
      />
    </>
  )
}
