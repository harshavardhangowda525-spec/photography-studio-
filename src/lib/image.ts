export interface ImageAsset {
  /** Largest/default source. */
  src: string
  /** Optional responsive candidates, e.g. "/a-800.webp 800w, /a-1600.webp 1600w". */
  srcSet?: string
  /** Intrinsic dimensions (or just the aspect ratio) — used to prevent layout shift. */
  width: number
  height: number
  /** True while this is generated placeholder art rather than studio photography. */
  placeholder?: boolean
}

const PLACEHOLDER_DIR = '/images/placeholders'

/** Build an asset for the generated placeholder set in /public/images/placeholders. */
export function placeholder(name: string, ratio: number, widths: number[] = [800, 1600]): ImageAsset {
  const largest = widths[widths.length - 1]
  return {
    src: `${PLACEHOLDER_DIR}/${name}-${largest}.webp`,
    srcSet: widths.map((w) => `${PLACEHOLDER_DIR}/${name}-${w}.webp ${w}w`).join(', '),
    width: largest,
    height: Math.round(largest / ratio),
    placeholder: true,
  }
}
