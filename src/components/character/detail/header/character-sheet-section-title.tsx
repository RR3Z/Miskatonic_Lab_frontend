export function CharacterSheetSectionTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <h2 className="mb-1.5 font-body text-xs uppercase tracking-[0.16em] text-[var(--ml-accent-brass-strong)]">
      {children}
    </h2>
  )
}
