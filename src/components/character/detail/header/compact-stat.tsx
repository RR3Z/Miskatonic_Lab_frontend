export function CompactStat({
  label,
  title,
  value,
}: {
  label: string
  title?: string
  value: number | string | null
}) {
  return (
    <div
      className="flex min-h-0 min-w-0 flex-col items-center justify-center rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/25 px-2 py-1 text-center"
      title={title}
    >
      <span className="block w-full min-w-0 truncate font-body text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
        {label}
      </span>
      <span className="block font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]">
        {value ?? "—"}
      </span>
    </div>
  )
}
