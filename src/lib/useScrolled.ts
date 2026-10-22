import { useEffect, useState } from 'react'

/** Tracks whether the page has scrolled past `threshold` and the current scroll direction. */
export function useScrollState(threshold = 40) {
  const [state, setState] = useState({ scrolled: false, hidden: false })
  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const update = () => {
      const y = window.scrollY
      const goingDown = y > last + 4
      const goingUp = y < last - 4
      setState((s) => {
        const hidden = y > 640 ? (goingDown ? true : goingUp ? false : s.hidden) : false
        const scrolled = y > threshold
        return hidden === s.hidden && scrolled === s.scrolled ? s : { scrolled, hidden }
      })
      last = y
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return state
}
