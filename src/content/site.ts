import { placeholder, type ImageAsset } from '../lib/image'

export interface Service {
  id: string
  title: string
  description: string
  detail: string
  /** Matching option in the enquiry form. */
  enquiryType: string
  image: ImageAsset
  alt: string
}

/** Proposed service categories for the website (confirm the final list with the studio). */
export const services: Service[] = [
  {
    id: 'event-photography',
    enquiryType: 'Event Photography',
    title: 'Event Photography',
    description: 'Preserving the atmosphere, expressions, and meaningful details of your special occasions.',
    detail: 'Celebrations, ceremonies and gatherings across Bengaluru — candid moments and the details in between.',
    image: placeholder('event-evening', 3 / 2),
    alt: 'Placeholder: guests silhouetted against warm string lights at an evening event',
  },
  {
    id: 'dance-performance',
    enquiryType: 'Dance & Classical Performance',
    title: 'Dance & Performance Photography',
    description: 'Capturing movement, precision, expression, and the emotion behind every performance.',
    detail: 'Classical recitals, Arangetrams and stage productions, photographed with respect for the art form.',
    image: placeholder('dance-arangetram', 3 / 2),
    alt: 'Placeholder: a classical dancer with arms outstretched on a spotlit stage',
  },
  {
    id: 'event-videography',
    enquiryType: 'Event Videography',
    title: 'Event Videography',
    description: 'Turning important occasions into cinematic films you can revisit for years to come.',
    detail: 'Thoughtful coverage that keeps the sound, movement and mood of the day intact.',
    image: placeholder('film-dusk', 3 / 2),
    alt: 'Placeholder: a letterboxed film still of a dusk horizon',
  },
  {
    id: 'music-concerts',
    enquiryType: 'Music & Concert Coverage',
    title: 'Music & Concert Coverage',
    description: 'Documenting the energy of live performances, artists, and unforgettable moments on stage.',
    detail: 'From intimate kutcheris to full stages — artists, audiences and everything in the air between them.',
    image: placeholder('music-stage', 16 / 9),
    alt: 'Placeholder: a performer on a concert stage under amber beams',
  },
  {
    id: 'portraits',
    enquiryType: 'Portrait Photography',
    title: 'Portrait Photography',
    description: 'Creating expressive portraits that bring personality and individuality into focus.',
    detail: 'Unhurried sessions with considered light, made to feel like you.',
    image: placeholder('portrait-rim', 4 / 5),
    alt: 'Placeholder: a rim-lit portrait silhouette',
  },
  {
    id: 'cinematic-films',
    enquiryType: 'Cinematic Film / Video Production',
    title: 'Cinematic Films',
    description: 'Thoughtfully composed visual stories that combine movement, atmosphere, and emotion.',
    detail: 'Short films and highlight edits composed frame by frame, with story first.',
    image: placeholder('film-horizon', 16 / 9),
    alt: 'Placeholder: a cinematic horizon with an anamorphic flare',
  },
]

/** Options offered in the enquiry form. */
export const enquiryTypes = [
  'Event Photography',
  'Event Videography',
  'Dance & Classical Performance',
  'Arangetram Photography & Videography',
  'Music & Concert Coverage',
  'Portrait Photography',
  'Cinematic Film / Video Production',
  'Something else',
]

export const steps = [
  {
    no: '01',
    title: "Let's talk",
    body: 'Tell us about your occasion, your ideas, and the moments you want us to capture.',
  },
  {
    no: '02',
    title: 'We create',
    body: 'We plan the shoot around your needs and focus on capturing the details that matter.',
  },
  {
    no: '03',
    title: 'Relive the moment',
    body: 'Receive your finished photographs or films and revisit the memories whenever you wish.',
  },
]

/**
 * Adapted from customer feedback supplied for this project — paraphrased, not verbatim.
 * If you switch to exact Google review text, paste it unchanged and keep the attribution.
 */
export const testimonials = [
  {
    name: 'Chandana Reddy',
    quote:
      'Mr. Satish is a truly passionate photographer. His eye for detail and ability to capture emotions and expressions made every photograph come alive.',
  },
  {
    name: 'Vani Janardhan',
    quote:
      'The quality of photos and videos was very good. The work captured real emotions, and the service was friendly and efficient.',
  },
  {
    name: 'Customer feedback',
    quote: 'Friendly service, quicker delivery of soft copies, and very reasonable pricing.',
  },
]

export const principles = [
  {
    title: 'Attention to Detail',
    body: 'The glance, the gesture, the fold of a sari mid-turn — small things carry whole memories.',
  },
  {
    title: 'Emotion-Led Storytelling',
    body: 'We follow feeling first, so the photographs read like the day felt.',
  },
  {
    title: 'A Thoughtful Creative Approach',
    body: 'Composition, light and timing are considered, never left to chance.',
  },
]
