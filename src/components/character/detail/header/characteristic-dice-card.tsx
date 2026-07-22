"use client"

import { DiceRollProgressOverlay } from "@/components/character/detail/dice-roll-progress-overlay"
import { CharacterSheetStatButton } from "@/components/character/detail/header/character-sheet-stat/character-sheet-stat-button"
import { CharacterSheetStatCard } from "@/components/character/detail/header/character-sheet-stat/character-sheet-stat-card"
import { ContextMenu } from "@/components/ui/context-menu/context-menu"
import { ContextMenuContent } from "@/components/ui/context-menu/context-menu-content"
import { ContextMenuItem } from "@/components/ui/context-menu/context-menu-item"
import { ContextMenuLabel } from "@/components/ui/context-menu/context-menu-label"
import { ContextMenuTrigger } from "@/components/ui/context-menu/context-menu-trigger"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import type { D100Mode } from "@/lib/api/character-dice-rolls"
import { getCharacteristicCheckThresholds } from "@/lib/dice/characteristic-check"
import { cn } from "@/lib/utils/cn.util"

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
        <span
          className={cn(
            "block w-full min-w-0 font-body leading-tight uppercase text-[var(--ml-ink-muted)]",
            label.length > 5
              ? "whitespace-nowrap text-[0.55rem] tracking-[0.04em]"
              : "break-words text-[0.65rem] tracking-[0.12em]",
          )}
        >
          {label}
        </span>
        <span className="font-mono text-base font-semibold tabular-nums text-[var(--ml-ink-primary)]">
          {value ?? "—"}
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
          aria-label={formatLocalizedTemplate(
            localizedContent.copy.characterDetailHeaderCharacteristicDiceCard
              .brositHarakteristikuValue0,
            { value0: title },
          )}
          className="relative grid grid-cols-[minmax(0,1fr)_auto] text-left"
          data-testid={`characteristic-card-${label}`}
          disabled={rolling}
          onClick={() => onRoll("normal")}
          title={title}
          type="button"
        >
          {content}
          {rolling ? <DiceRollProgressOverlay /> : null}
        </CharacterSheetStatButton>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>
          {
            localizedContent.copy.characterDetailHeaderCharacteristicDiceCard
              .broski
          }
        </ContextMenuLabel>
        <ContextMenuItem disabled={rolling} onSelect={() => onRoll("normal")}>
          {
            localizedContent.copy.characterDetailHeaderCharacteristicDiceCard
              .obychnyiBrosok
          }
        </ContextMenuItem>
        <ContextMenuItem
          className="text-[var(--ml-accent-success)] focus:bg-[color-mix(in_srgb,var(--ml-accent-success)_18%,transparent)] focus:text-[var(--ml-ink-primary)]"
          disabled={rolling}
          onSelect={() => onRoll("bonus")}
        >
          {
            localizedContent.copy.characterDetailHeaderCharacteristicDiceCard
              .brosokSPreimuschestvom
          }
        </ContextMenuItem>
        <ContextMenuItem
          className="text-[var(--ml-accent-danger)] focus:bg-[color-mix(in_srgb,var(--ml-accent-danger)_18%,transparent)] focus:text-[var(--ml-ink-primary)]"
          disabled={rolling}
          onSelect={() => onRoll("penalty")}
        >
          {
            localizedContent.copy.characterDetailHeaderCharacteristicDiceCard
              .brosokSPomehoi
          }
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
