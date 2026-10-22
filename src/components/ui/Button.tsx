import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { SmartLink } from './SmartLink'

type Variant = 'solid' | 'outline' | 'text'

const base =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 ease-[var(--ease-cinema)] disabled:cursor-not-allowed disabled:opacity-60'

const styles: Record<Variant, string> = {
  solid: 'min-h-12 px-7 py-4 bg-gold text-ink hover:text-ink',
  outline: 'min-h-12 px-7 py-4 border border-ivory/30 text-ivory hover:border-gold hover:text-ink',
  text: 'min-h-11 py-2 text-ivory hover:text-gold',
}

/** Fill wipe used by solid + outline buttons. */
function Wipe({ variant }: { variant: Variant }) {
  if (variant === 'text') return null
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-0 -z-0 origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-cinema)] group-hover:scale-x-100 group-focus-visible:scale-x-100 ${
        variant === 'solid' ? 'bg-ivory' : 'bg-gold'
      }`}
    />
  )
}

function Inner({ children, icon, variant }: { children: ReactNode; icon?: ReactNode; variant: Variant }) {
  return (
    <>
      <Wipe variant={variant} />
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 transition-transform duration-500 ease-[var(--ease-cinema)] group-hover:translate-x-1 group-hover:-translate-y-0.5">
        {icon ?? <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />}
      </span>
      {variant === 'text' && (
        <span
          aria-hidden="true"
          className="absolute bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 ease-[var(--ease-cinema)] group-hover:origin-left group-hover:scale-x-100"
        />
      )}
    </>
  )
}

interface ButtonLinkProps {
  to: string
  variant?: Variant
  icon?: ReactNode
  children: ReactNode
  className?: string
  'aria-label'?: string
}

export function ButtonLink({ to, variant = 'solid', icon, children, className = '', ...rest }: ButtonLinkProps) {
  return (
    <SmartLink to={to} className={`${base} ${styles[variant]} ${className}`} {...rest}>
      <Inner icon={icon} variant={variant}>
        {children}
      </Inner>
    </SmartLink>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
}

export function Button({ variant = 'solid', icon, children, className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={`${base} ${styles[variant]} ${className}`} {...rest}>
      <Inner icon={icon} variant={variant}>
        {children}
      </Inner>
    </button>
  )
}
