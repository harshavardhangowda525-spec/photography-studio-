import { m } from 'motion/react'
import { lineUp, stagger } from './presets'

interface SplitLinesProps {
  lines: string[]
  className?: string
  lineClassName?: string
  delay?: number
  /** Animate on mount instead of on scroll into view. */
  immediate?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'p'
  /** Indexes of lines set in italic for editorial contrast. */
  italic?: number[]
}

/** Editorial headline that reveals line by line through a mask. Text stays a single heading for screen readers. */
export function SplitLines({ lines, className, lineClassName = '', delay = 0, immediate, as = 'h2', italic = [] }: SplitLinesProps) {
  const Tag = m[as]
  const trigger = immediate
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
  return (
    <Tag className={className} variants={stagger(0.11, delay)} {...trigger}>
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]" aria-hidden="true">
          <m.span className={`block ${italic.includes(i) ? 'italic text-gold-soft' : ''} ${lineClassName}`} variants={lineUp}>
            {line}
          </m.span>
        </span>
      ))}
    </Tag>
  )
}
