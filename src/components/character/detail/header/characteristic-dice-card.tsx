"use client"

import {
  CharacterSheetStatButton,
  CharacterSheetStatCard,
} from "@/components/character/detail/header/character-sheet-stat-card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Spinner } from "@/components/ui/spinner"
import type { D100Mode } from "@/lib/api/character-dice-rolls"
import { getCharacteristicCheckThresholds } from "@/lib/dice/characteristic-check"

export function CharacteristicDiceCard({
  label,
  onRoll,
  rolling,
  title,
  value,
}: {
  label: string
  onRoll: (mode: D100Mode) => void
  rolling: boolean
  title: string
  value: number | null
}) {
  const thresholds =
    value === null ? null : getCharacteristicCheckThresholds(value)

  const content = (
    <>
      <div className="flex min-w-0 flex-col items-center justify-center px-2 py-1 text-center">
        <span className="block w-full min-w-0 break-words font-body text-[0.65rem] leading-tight uppercase tracking-[0.12em] text-[var(--ml-ink-muted)]">
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
      <CharacterSheetStatCard
        className="grid grid-cols-[minmax(0,1fr)_auto]"
        data-testid={`characteristic-card-${label}`}
        title={title}
      >
        {content}
      </CharacterSheetStatCard>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <CharacterSheetStatButton
          aria-label={`Бросить характеристику ${title}`}
          className="grid grid-cols-[minmax(0,1fr)_auto] text-left"
          data-testid={`characteristic-card-${label}`}
          disabled={rolling}
          onClick={() => onRoll("normal")}
          title={title}
          type="button"
        >
          {content}
        </CharacterSheetStatButton>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Броски</ContextMenuLabel>
        <ContextMenuItem disabled={rolling} onSelect={() => onRoll("normal")}>
          Обычный бросок
        </ContextMenuItem>
        <ContextMenuItem
          className="text-[var(--ml-accent-success)] focus:bg-[color-mix(in_srgb,var(--ml-accent-success)_18%,transparent)] focus:text-[var(--ml-ink-primary)]"
          disabled={rolling}
          onSelect={() => onRoll("bonus")}
        >
          Бросок с преимуществом
        </ContextMenuItem>
        <ContextMenuItem
          className="text-[var(--ml-accent-danger)] focus:bg-[color-mix(in_srgb,var(--ml-accent-danger)_18%,transparent)] focus:text-[var(--ml-ink-primary)]"
          disabled={rolling}
          onSelect={() => onRoll("penalty")}
        >
          Бросок с помехой
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
