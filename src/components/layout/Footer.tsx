import { ArrowUp, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { business, links } from '../../config/business'
import { navItems } from '../../config/navigation'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { Wordmark } from './Navigation'

export function Footer() {
  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    document.getElementById('main')?.focus({ preventScroll: true })
  }

  return (
    <footer className="paper relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-20 sm:px-8 lg:px-12 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark />
            <p className="mt-8 max-w-sm font-serif text-3xl leading-tight text-ivory md:text-4xl">
              Photography. Film. <em className="text-gold-soft">Stories that stay with you.</em>
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="eyebrow !font-sans !text-[0.65rem]">Explore</h2>
            <ul className="mt-6 space-y-3">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link-underline text-sm text-ivory/75 hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-5">
            <h2 className="eyebrow !font-sans !text-[0.65rem]">Visit &amp; contact</h2>
            <address className="mt-6 space-y-5 not-italic text-sm leading-relaxed text-ivory/75">
              <a href={links.tel} className="flex items-center gap-3 text-base text-ivory hover:text-gold">
                <Phone size={16} strokeWidth={1.5} aria-hidden="true" className="text-gold" />
                {business.phone.display}
              </a>
              <a
                href={links.whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-gold"
              >
                <WhatsAppIcon size={16} className="text-gold" />
                Message us on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
              <p className="flex gap-3">
                <MapPin size={16} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0 text-gold" />
                <span>
                  {business.address.street}, {business.address.locality}, {business.address.region}{' '}
                  {business.address.postalCode}.
                </span>
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-3 pl-7">
                <a
                  href={links.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold"
                >
                  Get directions<span className="sr-only"> on Google Maps (opens in a new tab)</span>
                </a>
                <a href={links.website} className="link-underline text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold">
                  {business.domain}
                </a>
                {business.socials.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </address>
          </div>
        </div>

        <div className="mt-20 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center md:pr-20">
          <p className="text-xs tracking-wide text-mute">© 2026 Rule Of Thirds. All rights reserved.</p>
          <button
            type="button"
            onClick={toTop}
            className="group flex min-h-11 items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ivory/70 hover:text-ivory"
          >
            Back to top
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:-translate-y-1 group-hover:border-gold">
              <ArrowUp size={15} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>

      {/* Oversized ghost wordmark */}
      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.2em] select-none whitespace-nowrap text-center font-serif text-[14.5vw] leading-none text-ivory/[0.035]"
      >
        Rule Of Thirds
      </p>
    </footer>
  )
}
