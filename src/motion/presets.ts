import type { Variants } from 'motion/react'

export const ease = {
  cinema: [0.22, 1, 0.36, 1] as const,
  soft: [0.65, 0, 0.35, 1] as const,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: ease.cinema } },
}

/** Line mask reveal: wrap each line in overflow-hidden and animate the inner span. */
export const lineUp: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1.15, ease: ease.cinema } },
}

export const stagger = (gap = 0.12, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

export const viewport = { once: true, margin: '0px 0px -12% 0px' } as const
