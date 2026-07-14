export function IdentityLine({
  label,
  testId,
  value,
}: {
  label: string
  testId?: string
  value: number | string | null
}) {
  return (
    <p
      className="truncate font-body text-sm leading-5 text-[var(--ml-ink-primary)]"
      data-testid={testId}
    >
      <span className="text-[var(--ml-ink-muted)]">{label}:</span>{" "}
      {value ?? "—"}
    </p>
  )
}
