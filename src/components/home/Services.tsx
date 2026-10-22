import { AnimatePresence, m } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { services } from '../../content/site'
import { ease } from '../../motion/presets'
import { Reveal } from '../../motion/Reveal'
import { ButtonLink } from '../ui/Button'
import { PlaceholderTag } from '../ui/PlaceholderTag'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { SectionHeading } from '../ui/SectionHeading'

export function Services() {
  const [active, setActive] = useState(0)
  const current = services[active]

  return (
    <section id="services" aria-labelledby="services-title" className="paper relative py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            id="services-title"
            eyebrow="What we do"
            lines={['Your story.', 'Our perspective.']}
            intro="Photography and film for the occasions, performances and people that matter to you."
          />
          <Reveal className="shrink-0">
            <ButtonLink to="/contact">Discuss your project</ButtonLink>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* Service list */}
          <ol className="border-t border-line lg:col-span-7">
            {services.map((s, i) => {
              const isActive = i === active
              return (
                <Reveal
                  as="li"
                  key={s.id}
                  delay={i * 0.05}
                  className="group relative border-b border-line"
                  onMouseEnter={() => setActive(i)}
                  onFocusCapture={() => setActive(i)}
                >
                  {/* Mobile/tablet: each service carries its own photograph */}
                  <div className="relative mt-8 aspect-[3/2] overflow-hidden bg-graphite lg:hidden">
                    <ResponsiveImage
                      image={s.image}
                      alt={s.alt}
                      sizes="(min-width: 768px) 90vw, 100vw"
                      className="h-full w-full object-cover"
                    />
                    {s.image.placeholder && <PlaceholderTag className="absolute left-3 top-3" />}
                  </div>

                  <div className="flex gap-6 py-8 md:gap-10 lg:py-10">
                    <span
                      className={`pt-2 font-sans text-[0.68rem] font-semibold tracking-[0.2em] transition-colors duration-500 ${
                        isActive ? 'text-gold' : 'text-mute'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <h3
                        className={`text-h3 transition-[color,transform] duration-700 ease-[var(--ease-cinema)] lg:group-hover:translate-x-2 ${
                          isActive ? 'text-ivory' : 'text-ivory lg:text-ivory/55'
                        }`}
                      >
                        {s.title}
                      </h3>
                      <p className="mt-3 max-w-lg leading-relaxed text-mute">{s.description}</p>
                      {/* Additional detail reveals for the active service on desktop; always shown on mobile */}
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-cinema)] ${
                          isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[1fr] opacity-100 lg:grid-rows-[0fr] lg:opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone/70">{s.detail}</p>
                          <Link
                            to={`/contact?service=${encodeURIComponent(s.enquiryType)}`}
                            className="mt-5 inline-flex min-h-11 items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold hover:text-gold-soft"
                          >
                            Enquire about {s.title.toLowerCase()}
                            <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ol>

          {/* Desktop: sticky photograph that follows the active service */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="frame">
                <div className="grain vignette relative aspect-[4/5] overflow-hidden bg-graphite">
                  <AnimatePresence initial={false}>
                    <m.div
                      key={current.id}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: ease.cinema }}
                    >
                      <ResponsiveImage
                        image={current.image}
                        alt={current.alt}
                        sizes="40vw"
                        className="h-full w-full object-cover"
                      />
                    </m.div>
                  </AnimatePresence>
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink/90 to-transparent p-8 pt-24">
                    <p className="eyebrow">{String(active + 1).padStart(2, '0')} / 06</p>
                    <p className="mt-3 font-serif text-3xl text-ivory">{current.title}</p>
                  </div>
                  {current.image.placeholder && <PlaceholderTag className="absolute left-4 top-4 z-10" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
