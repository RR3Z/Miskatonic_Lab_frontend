import { CharacterSheetStatCard } from "@/components/character/detail/header/character-sheet-stat/character-sheet-stat-card"

type DerivedStatCardProps = {
  label: string
  value: number | string | null
}

export function DerivedStatCard({ label, value }: DerivedStatCardProps) {
  return (
    <CharacterSheetStatCard
      className="flex flex-col items-center justify-center px-2 py-1"
      data-testid={`derived-stat-${label}`}
    >
      <span className="block w-full min-w-0 truncate font-body text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
        {label}
      </span>
      <span className="font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]">
        {value ?? "—"}
      </span>
    </CharacterSheetStatCard>
  )
}
