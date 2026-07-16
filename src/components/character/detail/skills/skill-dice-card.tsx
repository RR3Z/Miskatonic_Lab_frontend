"use client"

import { CharacterSheetStatButton } from "@/components/character/detail/header/character-sheet-stat-card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { D100Mode } from "@/lib/api/character-dice-rolls"
import { getCharacteristicCheckThresholds } from "@/lib/dice/characteristic-check"

export function SkillDiceCard({
  disabledReason,
  label,
  onRoll,
  rolling,
  value,
}: {
  disabledReason: string | null
  label: string
  onRoll: (mode: D100Mode) => void
  rolling: boolean
  value: number | null
}) {
  const thresholds =
    value === null ? null : getCharacteristicCheckThresholds(value)
  const content = (
    <>
      <div className="flex min-w-0 flex-col justify-center px-2 py-1 text-left">
        <span
          className="block min-w-0 break-words font-body text-[0.6rem] leading-tight font-medium uppercase tracking-[0.06em] text-[var(--ml-ink-primary)]"
          data-testid="character-skill-name"
        >
          {label}
        </span>
        <span
          className="font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]"
          data-testid="character-skill-value"
        >
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
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <CharacterSheetStatButton
              aria-disabled="true"
              aria-label={`Навык ${label} недоступен. ${disabledReason ?? "Не удалось рассчитать значение навыка."}`}
              className="grid h-full w-full cursor-not-allowed grid-cols-[minmax(0,1fr)_auto] opacity-65 hover:border-[var(--ml-border-subtle)] hover:bg-[var(--ml-bg-page)]/25"
              type="button"
            >
              {content}
            </CharacterSheetStatButton>
          </TooltipTrigger>
          <TooltipContent
            className="max-w-80 border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel-raised)] font-body text-[var(--ml-ink-primary)] shadow-[0_14px_40px_rgba(0,0,0,0.55)] [&>span>svg]:bg-[var(--ml-surface-panel-raised)] [&>span>svg]:fill-[var(--ml-surface-panel-raised)]"
            side="bottom"
            sideOffset={6}
          >
            {disabledReason ?? "Не удалось рассчитать значение навыка."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <CharacterSheetStatButton
          aria-label={`Бросить навык ${label}`}
          className="grid h-full w-full grid-cols-[minmax(0,1fr)_auto] text-left"
          disabled={rolling}
          onClick={() => onRoll("normal")}
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
