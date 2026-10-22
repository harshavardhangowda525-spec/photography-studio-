/** Small, honest marker shown on generated artwork until real studio photography replaces it. */
export function PlaceholderTag({ className = '' }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none select-none rounded-[2px] border border-ivory/15 bg-ink/55 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-ivory/70 backdrop-blur-sm ${className}`}
    >
      Placeholder image
    </span>
  )
}
