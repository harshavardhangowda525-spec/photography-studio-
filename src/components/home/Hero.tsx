import { m, useScroll, useTransform } from 'motion/react'
import { MapPin } from 'lucide-react'
import { useRef } from 'react'
import { media } from '../../config/media'
import type { Variants } from 'motion/react'
import { ease } from '../../motion/presets'
import { SplitLines } from '../../motion/SplitLines'
import { ButtonLink } from '../ui/Button'
import { PlaceholderTag } from '../ui/PlaceholderTag'
import { ResponsiveImage } from '../ui/ResponsiveImage'

/** Choreographed entrance: eyebrow → headline lines → supporting copy → buttons. */
const enter = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: ease.cinema, delay } },
})

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-ink"
    >
      {/* Background photograph: slow settle-in, then gentle parallax */}
      <m.div className="absolute inset-0 -z-10" style={{ y: imageY }}>
        <m.div
          className="h-full w-full"
          initial={{ scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.8, ease: ease.cinema }}
        >
          <ResponsiveImage
            image={media.hero}
            alt={media.hero.alt}
            sizes="100vw"
            priority
            className="h-full w-full object-cover object-[68%_50%]"
          />
        </m.div>
      </m.div>

      {/* Cinematic grading: readable left side, vignette, light leak and a slow light sweep */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/40" />
        <div className="vignette absolute inset-0" />
        <div className="animate-leak-drift absolute -right-[20%] -top-[30%] h-[80%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(199_168_120/0.20),transparent)] blur-2xl" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-light-sweep absolute -top-1/4 left-0 h-[150%] w-[22%] bg-gradient-to-r from-transparent via-ivory/[0.06] to-transparent" />
        </div>
      </div>

      {media.hero.placeholder && <PlaceholderTag className="absolute right-5 top-24 z-10 md:right-12 md:top-32" />}

      <m.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-28 pt-40 sm:px-8 md:pb-32 lg:px-12"
      >
        <m.div initial="hidden" animate="show" className="max-w-4xl">
          <m.p variants={enter(0.45)} className="eyebrow mb-7 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-gold/70" />
            Photography · Film · Storytelling
          </m.p>

          <div id="hero-title">
            <SplitLines
              as="h1"
              immediate
              delay={0.6}
              lines={['Some moments', 'deserve to', 'live forever.']}
              italic={[2]}
              className="text-display text-ivory"
            />
          </div>

          <m.p
            variants={enter(1.2)}
            className="mt-8 max-w-md text-base leading-relaxed text-stone/85 md:text-lg"
          >
            We capture the emotions, details, and stories that make every moment unforgettable.
          </m.p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <m.div variants={enter(1.4)}>
              <ButtonLink to="/#work" className="w-full sm:w-auto">
                Explore our work
              </ButtonLink>
            </m.div>
            <m.div variants={enter(1.52)}>
              <ButtonLink to="/contact" variant="outline" className="w-full sm:w-auto">
                Let&rsquo;s create something
              </ButtonLink>
            </m.div>
          </div>
        </m.div>
      </m.div>

      {/* Bottom rail: location + scroll cue */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.8, duration: 1 } }}
        className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1600px] items-end px-5 pb-7 sm:px-8 lg:px-12"
      >
        <p className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-ivory/70">
          <MapPin size={13} strokeWidth={1.5} aria-hidden="true" className="text-gold" />
          Based in Bengaluru, India
        </p>
        <a href="#intro" className="group absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-ivory/60 hover:text-ivory sm:flex">
          Scroll
          <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-ivory/15">
            <span className="animate-scroll-cue absolute inset-0 bg-gold" />
          </span>
        </a>
      </m.div>
    </section>
  )
}
