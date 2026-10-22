import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ContactForm } from '../components/contact/ContactForm'
import { PlaceholderTag } from '../components/ui/PlaceholderTag'
import { ResponsiveImage } from '../components/ui/ResponsiveImage'
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon'
import { business, links } from '../config/business'
import { media } from '../config/media'
import { useSeo } from '../lib/useSeo'
import { Reveal, RevealItem } from '../motion/Reveal'
import { SplitLines } from '../motion/SplitLines'

export default function Contact() {
  useSeo('/contact')
  const [params] = useSearchParams()

  return (
    <>
      <section aria-labelledby="contact-title" className="studio-light grain relative overflow-hidden pb-24 pt-36 md:pb-32 md:pt-48">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
            {/* Form column */}
            <div className="lg:col-span-7">
              <Reveal as="p" className="eyebrow mb-6 flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
                Enquiries &amp; bookings
              </Reveal>
              <div id="contact-title">
                <SplitLines
                  as="h1"
                  immediate
                  delay={0.2}
                  lines={['Tell us what', "you're planning."]}
                  italic={[1]}
                  className="text-[clamp(2.8rem,1.6rem+4.6vw,6.5rem)] leading-[0.98]"
                />
              </div>
              <Reveal as="p" delay={0.45} className="mt-8 max-w-lg text-base leading-relaxed text-mute md:text-lg">
                Share a few details about your occasion or project. We&rsquo;ll get in touch to discuss your requirements.
              </Reveal>

              <Reveal delay={0.6} className="mt-16">
                <ContactForm initialType={params.get('service') ?? ''} />
              </Reveal>
            </div>

            {/* Details column */}
            <aside aria-label="Studio contact details" className="lg:col-span-4 lg:col-start-9">
              <Reveal group={0.1} delay={0.4} className="lg:sticky lg:top-28">
                <RevealItem className="frame hidden lg:block">
                  <div className="grain vignette relative aspect-[4/3] overflow-hidden bg-graphite">
                    <ResponsiveImage image={media.contact} alt={media.contact.alt} sizes="30vw" className="h-full w-full object-cover" />
                    {media.contact.placeholder && <PlaceholderTag className="absolute left-3 top-3 z-10" />}
                  </div>
                </RevealItem>

                <RevealItem as="p" className="eyebrow mt-0 lg:mt-14">Prefer to talk?</RevealItem>
                <RevealItem className="mt-6 grid gap-3">
                  <a
                    href={links.whatsapp()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-14 items-center justify-between border border-gold/50 px-5 text-ivory transition-colors duration-500 hover:bg-gold hover:text-ink"
                  >
                    <span className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em]">
                      <WhatsAppIcon size={18} /> Chat on WhatsApp
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  <a
                    href={links.tel}
                    className="group flex min-h-14 items-center justify-between border border-line px-5 text-ivory transition-colors duration-500 hover:border-gold"
                  >
                    <span className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em]">
                      <Phone size={16} strokeWidth={1.5} aria-hidden="true" /> Call the studio
                    </span>
                    <span className="text-sm text-mute">{business.phone.display}</span>
                  </a>
                </RevealItem>

                <RevealItem as="dl" className="mt-12 space-y-8 border-t border-line pt-10 text-sm">
                  <div className="flex gap-4">
                    <dt className="pt-0.5">
                      <MapPin size={17} strokeWidth={1.5} className="text-gold" aria-hidden="true" />
                      <span className="sr-only">Address</span>
                    </dt>
                    <dd className="leading-relaxed text-stone/85">
                      <address className="not-italic">
                        {business.address.lines.map((l) => (
                          <span key={l} className="block">
                            {l}
                          </span>
                        ))}
                        <span className="block">
                          {business.address.locality}, {business.address.region} {business.address.postalCode}
                        </span>
                      </address>
                      <a
                        href={links.directions}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex min-h-11 items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold hover:text-gold-soft"
                      >
                        <Navigation size={14} strokeWidth={1.5} aria-hidden="true" /> Get directions
                        <span className="sr-only"> on Google Maps (opens in a new tab)</span>
                      </a>
                    </dd>
                  </div>
                  <div id="hours" className="flex gap-4">
                    <dt className="pt-0.5">
                      <Clock size={17} strokeWidth={1.5} className="text-gold" aria-hidden="true" />
                      <span className="sr-only">Business hours</span>
                    </dt>
                    <dd className="leading-relaxed text-stone/85">
                      <span className="block text-ivory">Business hours</span>
                      <span className="block">{business.hoursNote}.</span>
                      <span className="mt-1 block text-mute">
                        Please call or message ahead to confirm the day&rsquo;s timings before visiting.
                      </span>
                    </dd>
                  </div>
                </RevealItem>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
