import { m, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useRef, useState } from 'react'
import { steps } from '../../content/site'
import { stagger, viewport } from '../../motion/presets'
import { RevealItem } from '../../motion/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function Experience() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const [reached, setReached] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const n = v >= 0.98 ? 3 : v >= 0.5 ? 2 : v > 0.02 ? 1 : 0
    setReached((r) => (r === n ? r : n))
  })

  return (
    <section aria-labelledby="experience-title" className="studio-light grain relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          id="experience-title"
          eyebrow="The experience"
          lines={['From first hello', 'to the final frame.']}
          intro="A simple way to work together — shaped around your occasion, not a fixed formula."
        />

        <m.ol
          ref={ref}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger(0.15)}
          className="relative mt-20 grid gap-14 pl-10 md:mt-28 md:grid-cols-3 md:gap-10 md:pl-0">
          {/* Track: vertical on mobile, horizontal on desktop */}
          <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-line md:bottom-auto md:left-0 md:right-0 md:top-[5px] md:h-px md:w-auto" />
          <m.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-gold md:hidden"
          />
          <m.span
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="absolute left-0 right-0 top-[5px] hidden h-px origin-left bg-gold md:block"
          />

          {steps.map((step, i) => (
            <RevealItem as="li" key={step.no} className="relative md:pt-14">
              <span
                aria-hidden="true"
                className={`absolute -left-10 top-1 h-[11px] w-[11px] rounded-full border transition-colors duration-700 md:left-0 md:top-0 ${
                  reached > i ? 'border-gold bg-gold shadow-[0_0_18px_rgb(199_168_120/0.7)]' : 'border-ivory/40 bg-ink'
                }`}
              />
              <p aria-hidden="true" className="font-serif text-6xl leading-none text-ivory/25 md:text-7xl">{step.no}</p>
              <h3 className="mt-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-gold">
                {step.title}
              </h3>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-stone/80 md:text-lg">{step.body}</p>
            </RevealItem>
          ))}
        </m.ol>
      </div>
    </section>
  )
}
