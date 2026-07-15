"use client"

import { Spinner } from "@/components/ui/spinner"
import { getCharacteristicCheckThresholds } from "@/lib/dice/characteristic-check"

export function CharacteristicDiceCard({
  label,
  onRoll,
  rolling,
  title,
  value,
}: {
  label: string
  onRoll: () => void
  rolling: boolean
  title: string
  value: number | null
}) {
  const thresholds =
    value === null ? null : getCharacteristicCheckThresholds(value)

  const content = (
    <>
      <div className="flex min-w-0 flex-col items-center justify-center px-2 py-1 text-center">
        <span className="block w-full min-w-0 truncate font-body text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
          {label}
        </span>
        <span className="font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]">
          {rolling ? <Spinner className="size-3.5" /> : (value ?? "—")}
        </span>
      </div>
      <div className="grid min-w-8 grid-rows-2 border-l border-[var(--ml-border-subtle)] font-mono text-[0.65rem] tabular-nums text-[var(--ml-ink-muted)]">
        <span className="flex items-center justify-center border-b border-[var(--ml-border-subtle)] px-1">
          {thresholds?.half ?? "—"}
        </span>
        <span className="flex items-center justify-center px-1">
          {thresholds?.fifth ?? "—"}
        </span>
      </div>
    </>
  )

  if (value === null) {
    return (
      <div
        className="grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/25"
        data-testid={`characteristic-card-${label}`}
        title={title}
      >
        {content}
      </div>
    )
  }

  return (
    <button
      aria-label={`Бросить характеристику ${title}`}
      className="grid min-h-0 min-w-0 cursor-pointer grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-sm border border-[var(--ml-border-subtle)] bg-[var(--ml-bg-page)]/25 text-left transition-colors hover:border-[var(--ml-border-aged)] hover:bg-[var(--ml-surface-panel-raised)]/45 focus-visible:border-[var(--ml-focus-ring)] focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
      data-testid={`characteristic-card-${label}`}
      disabled={rolling}
      onClick={onRoll}
      title={title}
      type="button"
    >
      {content}
    </button>
  )
}
