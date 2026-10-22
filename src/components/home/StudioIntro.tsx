import { m, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { media } from '../../config/media'
import { Reveal, RevealItem } from '../../motion/Reveal'
import { ease } from '../../motion/presets'
import { SplitLines } from '../../motion/SplitLines'
import { ButtonLink } from '../ui/Button'
import { PlaceholderTag } from '../ui/PlaceholderTag'
import { ResponsiveImage } from '../ui/ResponsiveImage'

export function StudioIntro() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section id="intro" aria-labelledby="intro-title" className="studio-light relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto grid max-w-[1600px] items-center gap-16 px-5 sm:px-8 md:grid-cols-12 lg:gap-8 lg:px-12">
        {/* Image column — offset and framed */}
        <div ref={ref} className="md:col-span-6 lg:col-span-5 lg:col-start-1">
          <m.figure
            className="frame relative ml-4 md:ml-6"
            initial={{ clipPath: 'inset(12% 0 12% 0)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0% 0 0% 0)', opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1.4, ease: ease.cinema }}
          >
            <div className="grain vignette relative aspect-[4/5] overflow-hidden bg-graphite">
              <m.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
                <ResponsiveImage
                  image={media.intro}
                  alt={media.intro.alt}
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </m.div>
              {media.intro.placeholder && <PlaceholderTag className="absolute left-4 top-4 z-10" />}
            </div>
            <figcaption className="mt-5 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.26em] text-mute">
              <span>Frame 01 — The quiet before</span>
              <span className="text-gold">1/3</span>
            </figcaption>
          </m.figure>
        </div>

        {/* Copy column — set lower for asymmetry */}
        <Reveal group={0.12} className="md:col-span-6 lg:col-span-5 lg:col-start-8 lg:pt-24">
          <RevealItem as="p" className="eyebrow mb-6 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
            Behind the lens
          </RevealItem>
          <div id="intro-title">
            <SplitLines lines={['Every frame', 'has a feeling.']} italic={[1]} className="text-h2" />
          </div>
          <RevealItem as="p" className="mt-8 text-base leading-[1.85] text-mute md:text-lg">
            At Rule Of Thirds, photography is about more than what the eye sees. It is about the emotions,
            expressions, and details that make a moment truly yours. Our approach combines a thoughtful eye for
            composition with a passion for telling stories through images and film.
          </RevealItem>
          <RevealItem className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
            <p className="font-serif text-2xl italic text-gold-soft md:text-[1.75rem]">Stories worth remembering.</p>
          </RevealItem>
          <RevealItem className="mt-10">
            <ButtonLink to="/#about" variant="text">
              Discover our approach
            </ButtonLink>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
