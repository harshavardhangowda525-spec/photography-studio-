import { Star } from 'lucide-react'
import { business, links } from '../../config/business'
import { testimonials } from '../../content/site'
import { Reveal, RevealItem } from '../../motion/Reveal'
import { ButtonLink } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'

export function Testimonials() {
  const [lead, ...rest] = testimonials
  return (
    <section aria-labelledby="testimonials-title" className="paper relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="testimonials-title" eyebrow="In their words" lines={['Kind words.', 'Lasting memories.']} />

            <Reveal className="mt-12 border-t border-line pt-10">
              <p className="flex items-end gap-3">
                <span className="font-serif text-7xl leading-none text-ivory md:text-8xl">{business.rating.value}</span>
                <span className="pb-2 text-sm text-mute">/ 5.0</span>
              </p>
              <div className="mt-4 flex gap-1 text-gold" role="img" aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                ))}
              </div>
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-stone/80">
                {business.rating.count} {business.rating.source} reviews
              </p>
              <div className="mt-10">
                <ButtonLink to={links.reviews} variant="outline">
                  Read customer reviews
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal as="figure" className="relative">
              <span aria-hidden="true" className="absolute -left-2 -top-16 font-serif text-[10rem] leading-none text-gold/20 md:-left-10">
                &ldquo;
              </span>
              <blockquote className="relative font-serif text-[1.85rem] leading-[1.25] text-ivory md:text-[2.6rem]">
                <p>{lead.quote}</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-gold">
                <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
                {lead.name}
              </figcaption>
            </Reveal>

            <Reveal group={0.15} className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-2">
              {rest.map((t) => (
                <RevealItem as="figure" key={t.name}>
                  <blockquote className="font-serif text-xl leading-snug text-stone md:text-2xl">
                    <p>&ldquo;{t.quote}&rdquo;</p>
                  </blockquote>
                  <figcaption className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-mute">
                    {t.name}
                  </figcaption>
                </RevealItem>
              ))}
            </Reveal>

            <p className="mt-14 max-w-xl text-xs leading-relaxed text-mute/80">
              Testimonials are adapted from customer feedback shared on Google and are paraphrased rather than quoted
              verbatim. Rating and review count as listed on the studio&rsquo;s Google profile.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
