import type { ReactNode } from 'react'
import { Reveal } from '../../motion/Reveal'
import { SplitLines } from '../../motion/SplitLines'

interface SectionHeadingProps {
  eyebrow?: string
  lines: string[]
  intro?: ReactNode
  align?: 'left' | 'center'
  id?: string
  className?: string
}

export function SectionHeading({ eyebrow, lines, intro, align = 'left', id, className = '' }: SectionHeadingProps) {
  const center = align === 'center'
  return (
    <header className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && (
        <Reveal as="p" className={`eyebrow mb-6 flex items-center gap-4 ${center ? 'justify-center' : ''}`}>
          <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
          {eyebrow}
        </Reveal>
      )}
      <div id={id}>
        <SplitLines lines={lines} className="text-h2 text-ivory" />
      </div>
      {intro && (
        <Reveal as="p" delay={0.2} className={`mt-6 max-w-xl text-base leading-relaxed text-mute md:text-lg ${center ? 'mx-auto' : ''}`}>
          {intro}
        </Reveal>
      )}
    </header>
  )
}
