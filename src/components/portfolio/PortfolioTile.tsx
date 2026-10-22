import { Play } from 'lucide-react'
import { categoryLabel, type PortfolioItem } from '../../content/portfolio'
import { PlaceholderTag } from '../ui/PlaceholderTag'
import { ResponsiveImage } from '../ui/ResponsiveImage'

interface PortfolioTileProps {
  item: PortfolioItem
  onOpen: () => void
  sizes: string
  /** Fill the parent box (editorial grid) instead of keeping the image's own ratio (masonry). */
  fill?: boolean
  longLabel?: boolean
}

export function PortfolioTile({ item, onOpen, sizes, fill, longLabel }: PortfolioTileProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${categoryLabel(item.category, longLabel)} ${item.title} — ${item.video ? 'play film' : 'view larger'}`}
      className={`group relative block w-full overflow-hidden bg-graphite text-left ${fill ? 'h-full' : ''}`}
      aria-haspopup="dialog"
    >
      <ResponsiveImage
        image={item.image}
        alt={item.alt}
        sizes={sizes}
        className={`w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-cinema)] group-hover:scale-[1.05] group-focus-visible:scale-[1.05] ${
          fill ? 'h-full' : 'h-auto'
        }`}
      />
      {/* Hover overlay + label */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
        <span className="block">
          <span className="block translate-y-2 text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-gold opacity-80 transition-all duration-700 ease-[var(--ease-cinema)] group-hover:translate-y-0 group-hover:opacity-100">
            {categoryLabel(item.category, longLabel)}
          </span>
          <span className="mt-2 block font-serif text-xl leading-tight text-ivory md:text-2xl">{item.title}</span>
        </span>
        {item.video && (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ivory/40 text-ivory transition-colors duration-500 group-hover:border-gold group-hover:text-gold">
            <Play size={15} strokeWidth={1.5} aria-hidden="true" className="translate-x-px" />
          </span>
        )}
      </span>
      {item.image.placeholder && <PlaceholderTag className="absolute left-3 top-3" />}
    </button>
  )
}
