import { placeholder, type ImageAsset } from '../lib/image'

/**
 * Portfolio content. To add real work:
 *  1. Put optimised images (WebP/AVIF, ~1600px long edge) in /public/images/work/
 *  2. Add an entry below with `image: { src, width, height }` (set placeholder: false or omit it)
 *  3. For films, add `video: [{ src, type }]` (WebM + MP4 recommended) — the image is used as the poster.
 * Remove the generated placeholder entries once real work is in place.
 */

export const categories = [
  { id: 'events', label: 'Events', longLabel: 'Events & Celebrations' },
  { id: 'dance', label: 'Dance', longLabel: 'Dance & Performances' },
  { id: 'portraits', label: 'Portraits', longLabel: 'Portraits' },
  { id: 'music', label: 'Music', longLabel: 'Music & Concerts' },
  { id: 'films', label: 'Films', longLabel: 'Cinematic Films' },
  { id: 'bts', label: 'Behind the Scenes', longLabel: 'Behind the Scenes' },
] as const

export type CategoryId = (typeof categories)[number]['id']

export interface PortfolioItem {
  id: string
  title: string
  category: CategoryId
  image: ImageAsset
  alt: string
  caption?: string
  /** Film sources, best first (e.g. WebM then MP4). The image doubles as the poster. */
  video?: { src: string; type: string }[]
}

export const categoryLabel = (id: CategoryId, long = false) => {
  const c = categories.find((c) => c.id === id)!
  return long ? c.longLabel : c.label
}

export const portfolio: PortfolioItem[] = [
  {
    id: 'dance-adavu',
    title: 'The First Adavu',
    category: 'dance',
    image: placeholder('dance-adavu', 4 / 5),
    alt: 'Placeholder: a Bharatanatyam dancer mid-adavu, silhouetted under a narrow spotlight',
    caption: 'Precision and line under a single spotlight.',
  },
  {
    id: 'event-evening',
    title: 'An Evening to Remember',
    category: 'events',
    image: placeholder('event-evening', 3 / 2),
    alt: 'Placeholder: two guests silhouetted against warm string lights and bokeh at an evening celebration',
    caption: 'Warm light, close company, a room full of glow.',
  },
  {
    id: 'portrait-rim',
    title: 'Quiet Light',
    category: 'portraits',
    image: placeholder('portrait-rim', 4 / 5),
    alt: 'Placeholder: a head-and-shoulders portrait edged by soft side light',
    caption: 'A portrait shaped by a single window of light.',
  },
  {
    id: 'music-vocal',
    title: 'Front Row Energy',
    category: 'music',
    image: placeholder('music-vocal', 3 / 2),
    alt: 'Placeholder: a vocalist on stage under amber beams with a crowd raising hands in the foreground',
    caption: 'Stage beams, haze and an audience on its feet.',
  },
  {
    id: 'film-horizon',
    title: 'Horizon — Film Still',
    category: 'films',
    image: placeholder('film-horizon', 16 / 9),
    alt: 'Placeholder: a letterboxed film frame of a horizon at dusk with an anamorphic flare',
    caption: 'An eight-second sample clip demonstrating video playback.',
    video: [
      { src: '/media/film-horizon-placeholder.webm', type: 'video/webm' },
      { src: '/media/film-horizon-placeholder.mp4', type: 'video/mp4' },
    ],
  },
  {
    id: 'bts-monitor',
    title: 'Through the Monitor',
    category: 'bts',
    image: placeholder('bts-monitor', 3 / 2),
    alt: 'Placeholder: a camera monitor framing a dancer, with rule-of-thirds guides overlaid',
    caption: 'Composing on the thirds, between takes.',
  },
  {
    id: 'dance-arangetram',
    title: 'Arangetram — The Debut',
    category: 'dance',
    image: placeholder('dance-arangetram', 3 / 2),
    alt: 'Placeholder: a dancer with arms outstretched on a wide stage lit by crossing beams',
    caption: 'The full stage, the full story of a debut performance.',
  },
  {
    id: 'event-lights',
    title: 'Celebration in Bokeh',
    category: 'events',
    image: placeholder('event-lights', 4 / 5),
    alt: 'Placeholder: out-of-focus amber and gold lights from a celebration',
  },
  {
    id: 'portrait-window',
    title: 'North Light',
    category: 'portraits',
    image: placeholder('portrait-window', 2 / 3),
    alt: 'Placeholder: a portrait silhouette lit from the right by cool, soft light',
  },
  {
    id: 'music-violin',
    title: 'The Encore',
    category: 'music',
    image: placeholder('music-violin', 4 / 5),
    alt: 'Placeholder: a performer silhouetted by golden stage beams above a crowd',
  },
  {
    id: 'dance-arc',
    title: 'Arc of the Arms',
    category: 'dance',
    image: placeholder('dance-arc', 3 / 4),
    alt: 'Placeholder: a dancer with both arms raised in an arc beneath an amber spotlight',
  },
  {
    id: 'film-dusk',
    title: 'Dusk — Film Still',
    category: 'films',
    image: placeholder('film-dusk', 3 / 2),
    alt: 'Placeholder: a letterboxed frame of a red dusk horizon and a lone figure',
  },
  {
    id: 'bts-studio',
    title: 'Setting the Light',
    category: 'bts',
    image: placeholder('bts-studio', 4 / 5),
    alt: 'Placeholder: a camera on a tripod beside a glowing softbox in the studio',
  },
  {
    id: 'event-reception',
    title: 'The Reception',
    category: 'events',
    image: placeholder('event-reception', 16 / 10),
    alt: 'Placeholder: guests silhouetted beneath festoon lights at a reception',
  },
  {
    id: 'dance-solo',
    title: 'Solo',
    category: 'dance',
    image: placeholder('dance-solo', 2 / 3),
    alt: 'Placeholder: a solo dancer extending one arm, lit from above',
  },
  {
    id: 'portrait-amber',
    title: 'Amber Hour',
    category: 'portraits',
    image: placeholder('portrait-amber', 1),
    alt: 'Placeholder: a portrait silhouette with a warm amber rim light',
  },
  {
    id: 'music-stage',
    title: 'Main Stage',
    category: 'music',
    image: placeholder('music-stage', 16 / 9),
    alt: 'Placeholder: a wide concert stage with red and amber beams over the crowd',
  },
]

/** One hand-picked item per category for the home page. */
export const featuredIds = ['dance-adavu', 'event-evening', 'portrait-rim', 'music-vocal', 'film-horizon', 'bts-monitor']
export const featured = featuredIds.map((id) => portfolio.find((p) => p.id === id)!)
