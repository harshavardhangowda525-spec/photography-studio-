export const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Our Work', to: '/work' },
  { label: 'Services', to: '/#services' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/contact' },
] as const

export const isNavActive = (to: string, pathname: string, hash: string) => {
  const [path, anchor] = to.split('#')
  if (anchor) return pathname === '/' && hash === `#${anchor}`
  if (path === '/') return pathname === '/' && !['#services', '#about'].includes(hash)
  return pathname.startsWith(path)
}
