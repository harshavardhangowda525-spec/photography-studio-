import { m } from 'motion/react'
import { useState } from 'react'
import { featured, type PortfolioItem } from '../../content/portfolio'
import { ease } from '../../motion/presets'
import { Reveal } from '../../motion/Reveal'
import { Lightbox } from '../portfolio/Lightbox'
import { PortfolioTile } from '../portfolio/PortfolioTile'
import { ButtonLink } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'

function Tile({
  item,
  aspect,
  sizes,
  onOpen,
  delay = 0,
}: {
  item: PortfolioItem
  aspect: string
  sizes: string
  onOpen: () => void
  delay?: number
}) {
  return (
    <m.div
      className={`relative ${aspect}`}
      initial={{ clipPath: 'inset(8% 8% 8% 8%)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, ease: ease.cinema, delay }}
    >
      <PortfolioTile item={item} onOpen={onOpen} sizes={sizes} fill longLabel />
    </m.div>
  )
}

export function FeaturedPortfolio() {
  const [index, setIndex] = useState<number | null>(null)
  const [dance, events, portrait, music, film, bts] = featured
  const open = (item: PortfolioItem) => () => setIndex(featured.indexOf(item))

  return (
    <section id="work" aria-labelledby="work-title" className="grain relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <SectionHeading
            id="work-title"
            eyebrow="Selected work"
            lines={['Stories,', 'captured beautifully.']}
            intro="A collection of moments, performances, and memories told through our lens."
          />
          <Reveal className="shrink-0">
            <ButtonLink to="/work" variant="text">
              View the full portfolio
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:mt-24 md:grid-cols-12 md:gap-6 lg:gap-8">
          {/* Column A */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-5 md:gap-6 lg:gap-8">
            <Tile item={dance} aspect="aspect-[4/5]" sizes="(min-width: 768px) 42vw, 100vw" onOpen={open(dance)} />
            <Tile item={music} aspect="aspect-[3/2]" sizes="(min-width: 768px) 42vw, 100vw" onOpen={open(music)} />
            <Reveal className="hidden pt-6 md:block">
              <p className="max-w-xs font-serif text-2xl italic leading-snug text-stone/80">
                A fleeting expression, the energy of a performance &mdash; noticed, and kept.
              </p>
              <div className="hairline mt-6 w-24" />
            </Reveal>
          </div>

          {/* Column B — dropped lower for an asymmetric, masonry rhythm */}
          <div className="col-span-2 grid grid-cols-2 gap-4 md:col-span-6 md:col-start-7 md:gap-6 md:pt-32 lg:gap-8">
            <div className="col-span-2">
              <Tile item={events} aspect="aspect-[3/2]" sizes="(min-width: 768px) 50vw, 100vw" onOpen={open(events)} />
            </div>
            <Tile item={portrait} aspect="aspect-[4/5]" sizes="(min-width: 768px) 25vw, 50vw" onOpen={open(portrait)} />
            <Tile item={bts} aspect="aspect-[4/5]" sizes="(min-width: 768px) 25vw, 50vw" onOpen={open(bts)} delay={0.12} />
            <div className="col-span-2">
              <Tile item={film} aspect="aspect-[16/9]" sizes="(min-width: 768px) 50vw, 100vw" onOpen={open(film)} />
            </div>
          </div>
        </div>
      </div>

      <Lightbox items={featured} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </section>
  )
}
