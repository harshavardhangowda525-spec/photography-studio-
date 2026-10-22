import { placeholder, type ImageAsset } from '../lib/image'

/**
 * Site-wide imagery outside the portfolio. Swap any entry for a real photograph:
 *   hero: { src: '/images/hero.jpg', width: 2400, height: 1350 }
 */
export const media: Record<'hero' | 'intro' | 'about' | 'cta' | 'contact', ImageAsset & { alt: string }> = {
  hero: {
    ...placeholder('hero-stage', 16 / 9, [960, 1600, 2400]),
    alt: 'A classical dancer in a half-seated pose, rim-lit by a single warm spotlight on a dark stage',
  },
  intro: {
    ...placeholder('studio-intro', 4 / 5),
    alt: 'A portrait subject in silhouette, edged by soft window light in a dark studio',
  },
  about: {
    ...placeholder('bts-studio', 4 / 5),
    alt: 'A camera on a tripod beside a glowing softbox in a darkened photography studio',
  },
  cta: {
    ...placeholder('cta-film', 21 / 9, [960, 1600, 2400]),
    alt: 'A cinematic, letterboxed horizon at dusk with a lone figure beside a tree',
  },
  contact: {
    ...placeholder('portrait-amber', 1),
    alt: 'A softly lit portrait silhouette against warm amber light',
  },
}
