import { Link, type LinkProps } from 'react-router-dom'
import type { AnchorHTMLAttributes } from 'react'

type SmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  state?: LinkProps['state']
}

const isExternal = (to: string) => /^(https?:|mailto:|tel:)/.test(to)

/** Router link for internal paths (incl. "/#section"), plain anchor for tel:, mailto: and external URLs. */
export function SmartLink({ to, children, state, ...rest }: SmartLinkProps) {
  if (isExternal(to)) {
    const newTab = to.startsWith('http')
    return (
      <a href={to} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
        {newTab && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    )
  }
  return (
    <Link to={to} state={state} {...rest}>
      {children}
    </Link>
  )
}
