import { m, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { media } from '../../config/media'
import { principles } from '../../content/site'
import { Reveal, RevealItem } from '../../motion/Reveal'
import { SplitLines } from '../../motion/SplitLines'
import { PlaceholderTag } from '../ui/PlaceholderTag'
import { ResponsiveImage } from '../ui/ResponsiveImage'

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-ink lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Photograph half */}
      <div ref={ref} className="grain vignette relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-auto">
        <m.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
          <ResponsiveImage
            image={media.about}
            alt={media.about.alt}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        </m.div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-ink/40" />
        {media.about.placeholder && <PlaceholderTag className="absolute left-4 top-4 z-10 lg:top-28" />}
        <p className="absolute bottom-6 left-5 z-10 text-[0.62rem] uppercase tracking-[0.3em] text-ivory/60 sm:left-8 lg:left-12">
          In the studio — Kumaraswamy Layout
        </p>
      </div>

      {/* Copy half */}
      <div className="flex items-center px-5 py-24 sm:px-8 md:py-32 lg:px-16 xl:px-24">
        <div className="max-w-xl">
          <Reveal as="p" className="eyebrow mb-6 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
            Our philosophy
          </Reveal>
          <div id="about-title">
            <SplitLines lines={['Not just pictures.', 'Pieces of your story.']} italic={[1]} className="text-h2" />
          </div>
          <Reveal group={0.12} className="mt-10 space-y-6 text-base leading-[1.85] text-mute md:text-lg">
            <RevealItem as="p">
              Great photography is about noticing what others might miss. A fleeting expression, the energy of a
              performance, a meaningful glance, or a detail that brings an entire memory back to life.
            </RevealItem>
            <RevealItem as="p">
              Rule Of Thirds approaches visual storytelling with care, creativity, and an appreciation for the
              moments that matter.
            </RevealItem>
          </Reveal>

          <Reveal as="ul" group={0.12} className="mt-14 border-t border-line">
            {principles.map((p, i) => (
              <RevealItem as="li" key={p.title} className="flex gap-6 border-b border-line py-6">
                <span className="w-6 shrink-0 pt-1 text-[0.65rem] font-semibold tracking-[0.2em] text-gold">
                  {['I', 'II', 'III'][i]}
                </span>
                <div>
                  <h3 className="font-serif text-2xl text-ivory">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{p.body}</p>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
