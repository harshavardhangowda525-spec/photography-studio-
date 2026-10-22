import { m, useScroll, useTransform } from 'motion/react'
import { Phone } from 'lucide-react'
import { useRef } from 'react'
import { links } from '../../config/business'
import { media } from '../../config/media'
import { Reveal, RevealItem } from '../../motion/Reveal'
import { SplitLines } from '../../motion/SplitLines'
import { ButtonLink } from '../ui/Button'
import { PlaceholderTag } from '../ui/PlaceholderTag'
import { ResponsiveImage } from '../ui/ResponsiveImage'

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.12, 1])

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="cta-title"
      className="grain relative flex min-h-[90svh] items-center overflow-hidden bg-ink py-32"
    >
      <m.div style={{ y, scale }} className="absolute -inset-y-[14%] inset-x-0 -z-10">
        <ResponsiveImage image={media.cta} alt={media.cta.alt} sizes="100vw" className="h-full w-full object-cover" />
      </m.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/30" />
      <div aria-hidden="true" className="vignette absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_55%,transparent,rgb(16_16_16/0.75))]"
      />
      {media.cta.placeholder && <PlaceholderTag className="absolute right-5 top-6 z-10 md:right-12" />}

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
        <Reveal as="p" className="eyebrow mb-8 flex items-center justify-center gap-4">
          <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
          Your next chapter
          <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
        </Reveal>
        <div id="cta-title">
          <SplitLines
            lines={["Let's capture", 'something unforgettable.']}
            italic={[1]}
            className="text-[clamp(2.6rem,1.5rem+5vw,6.5rem)] leading-[0.98]"
          />
        </div>
        <Reveal group={0.12} delay={0.3}>
          <RevealItem as="p" className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-stone/85 md:text-lg">
            Have an event, performance, or special moment coming up? Tell us about it, and let&rsquo;s explore how we can
            bring your story to life.
          </RevealItem>
          <RevealItem className="mt-12 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <ButtonLink to="/contact">Start a conversation</ButtonLink>
            <ButtonLink to={links.tel} variant="outline" icon={<Phone size={15} strokeWidth={1.5} aria-hidden="true" />}>
              Call the studio
            </ButtonLink>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
