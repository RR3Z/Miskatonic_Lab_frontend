export function EmptySection({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-32 place-items-center rounded-sm border border-dashed border-[var(--ml-border-subtle)] px-5 py-6 text-center font-body text-sm text-[var(--ml-ink-muted)]">
      {children}
    </div>
  )
}
