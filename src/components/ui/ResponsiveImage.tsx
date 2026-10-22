import type { ImgHTMLAttributes } from 'react'
import type { ImageAsset } from '../../lib/image'

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> {
  image: ImageAsset
  alt: string
  sizes?: string
  priority?: boolean
}

/** <img> with srcset, intrinsic size (no layout shift) and lazy loading unless `priority`. */
export function ResponsiveImage({ image, alt, sizes = '100vw', priority, className, ...rest }: ResponsiveImageProps) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      {...rest}
    />
  )
}
