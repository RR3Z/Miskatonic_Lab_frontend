export function CharacterSheetSectionTitle({
  action,
  children,
}: {
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mb-1 flex min-h-6 items-center justify-between gap-1">
      <h2 className="font-body text-xs uppercase tracking-[0.16em] text-[var(--ml-accent-brass-strong)]">
        {children}
      </h2>
      {action}
    </div>
  )
}
