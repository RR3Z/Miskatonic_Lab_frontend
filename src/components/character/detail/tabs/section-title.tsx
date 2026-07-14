export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-lg font-semibold text-[var(--ml-ink-primary)]">
      {children}
    </h2>
  )
}
