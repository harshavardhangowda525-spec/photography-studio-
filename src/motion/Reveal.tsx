import { m, type HTMLMotionProps, type Variants } from 'motion/react'
import { fadeUp, stagger, viewport } from './presets'

type Tag = 'div' | 'section' | 'ul' | 'li' | 'p' | 'span' | 'figure' | 'header' | 'ol' | 'article' | 'dl'

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  as?: Tag
  variants?: Variants
  /** Delay before this element (or its children, when `group`) animate. */
  delay?: number
  /** Turn into a stagger container for child <Reveal> / m elements. */
  group?: number
}

function withDelay(v: Variants, delay: number): Variants {
  if (!delay || typeof v.show !== 'object') return v
  const show = v.show as { transition?: object }
  return { ...v, show: { ...show, transition: { ...show.transition, delay } } }
}

/** Scroll-triggered reveal. Respects reduced motion via the global <MotionConfig>. */
export function Reveal({ as = 'div', variants, delay = 0, group, children, ...rest }: RevealProps) {
  const Component = m[as] as typeof m.div
  const v = group !== undefined ? stagger(group, delay) : withDelay(variants ?? fadeUp, delay)
  return (
    <Component
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={v}
      {...rest}
    >
      {children}
    </Component>
  )
}

/** Child of a Reveal group: inherits hidden/show from the parent. */
export function RevealItem({ as = 'div', variants = fadeUp, children, ...rest }: Omit<RevealProps, 'group' | 'delay'>) {
  const Component = m[as] as typeof m.div
  return (
    <Component variants={variants} {...rest}>
      {children}
    </Component>
  )
}
