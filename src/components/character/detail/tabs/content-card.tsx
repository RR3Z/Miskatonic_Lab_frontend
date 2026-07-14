export function ContentCard({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <article className="rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/20 p-3">
      <h3 className="font-heading text-base font-semibold text-[var(--ml-ink-primary)]">
        {title}
      </h3>
      <div className="mt-2 whitespace-pre-wrap font-body text-sm leading-6 text-[var(--ml-ink-muted)]">
        {children}
      </div>
    </article>
  )
}
