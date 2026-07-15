"use client"

import { Spinner } from "@/components/ui/spinner"

export function DamageBonusRoll({
  onRoll,
  rolling,
  value,
}: {
  onRoll: (formula: string) => void
  rolling: boolean
  value: string | null
}) {
  const formula = value?.includes("d") ? value : null
  const content = (
    <>
      <span className="block w-full min-w-0 truncate font-body text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
        Бонус урона
      </span>
      <span className="font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]">
        {rolling ? <Spinner className="size-3.5" /> : (value ?? "—")}
      </span>
    </>
  )

  if (formula === null) {
    return (
      <div
        className="flex min-h-0 min-w-0 flex-col items-center justify-center rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/25 px-2 py-1 text-center"
        data-testid="damage-bonus-stat"
      >
        {content}
      </div>
    )
  }

  return (
    <button
      aria-label={`Бросить бонус урона ${formula}`}
      className="flex min-h-0 min-w-0 cursor-pointer flex-col items-center justify-center rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/25 px-2 py-1 text-center transition-colors hover:border-[var(--ml-border-aged)] hover:bg-[var(--ml-surface-panel-raised)]/45 focus-visible:border-[var(--ml-focus-ring)] focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
      data-testid="damage-bonus-stat"
      disabled={rolling}
      onClick={() => onRoll(formula)}
      type="button"
    >
      {content}
    </button>
  )
}
