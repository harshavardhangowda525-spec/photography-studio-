/**
 * Single source of truth for Rule Of Thirds business details.
 * Only verified information belongs here. Anything marked `null` is
 * intentionally unset until the studio confirms it.
 */
export const business = {
  name: 'Rule Of Thirds',
  tagline: 'Photography. Film. Stories that stay with you.',
  category: 'Photography Studio',
  domain: 'ruleofthirds.in',

  phone: {
    display: '+91 85498 88399',
    e164: '+918549888399',
    whatsapp: '918549888399',
  },

  address: {
    lines: ['2nd Floor, 1067, 50 Feet Main Road', 'Opposite HDFC Bank, 1st Stage', 'Kumaraswamy Layout'],
    street: '2nd Floor, 1067, 50 Feet Main Road, opposite HDFC Bank, 1st Stage, Kumaraswamy Layout',
    locality: 'Bengaluru',
    region: 'Karnataka',
    postalCode: '560111',
    country: 'IN',
    countryName: 'India',
  },

  /** Supplied as "open until 11:30 PM"; the full weekly schedule is not confirmed. */
  hoursNote: 'Listed as open until 11:30 PM',

  rating: { value: '5.0', count: 52, source: 'Google' },

  /**
   * Replace with the studio's verified Google Business Profile link when available.
   * Until then this opens a Google Maps search for the studio, which surfaces its profile and reviews.
   */
  reviewsUrl: null as string | null,

  /** Add official accounts only once confirmed, e.g. { label: 'Instagram', href: 'https://instagram.com/…' } */
  socials: [] as { label: string; href: string }[],

  whatsappGreeting:
    "Hi Rule Of Thirds, I'm interested in your photography/videography services. I'd like to discuss my requirements.",
} as const

const fullAddress = `${business.address.street}, ${business.address.locality}, ${business.address.region} ${business.address.postalCode}, ${business.address.countryName}`

const mapsQuery = `${business.name}, ${fullAddress}`

export const links = {
  tel: `tel:${business.phone.e164}`,
  whatsapp: (message: string = business.whatsappGreeting) =>
    `https://wa.me/${business.phone.whatsapp}?text=${encodeURIComponent(message)}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`,
  reviews:
    business.reviewsUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
  website: `https://${business.domain}`,
}
