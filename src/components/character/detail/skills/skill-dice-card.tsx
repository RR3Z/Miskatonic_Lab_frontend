"use client"

import { DiceRollProgressOverlay } from "@/components/character/detail/dice-roll-progress-overlay"
import { CharacterSheetStatButton } from "@/components/character/detail/header/character-sheet-stat/character-sheet-stat-button"
import { ContextMenu } from "@/components/ui/context-menu/context-menu"
import { ContextMenuContent } from "@/components/ui/context-menu/context-menu-content"
import { ContextMenuItem } from "@/components/ui/context-menu/context-menu-item"
import { ContextMenuLabel } from "@/components/ui/context-menu/context-menu-label"
import { ContextMenuTrigger } from "@/components/ui/context-menu/context-menu-trigger"
import { Tooltip } from "@/components/ui/tooltip/tooltip"
import { TooltipContent } from "@/components/ui/tooltip/tooltip-content"
import { TooltipProvider } from "@/components/ui/tooltip/tooltip-provider"
import { TooltipTrigger } from "@/components/ui/tooltip/tooltip-trigger"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
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
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <CharacterSheetStatButton
              aria-disabled="true"
              aria-label={formatLocalizedTemplate(
                localizedContent.copy.characterDetailSkillsSkillDiceCard
                  .navykValue0NedostupenValue1,
                {
                  value0: label,
                  value1:
                    disabledReason ??
                    localizedContent.copy.characterDetailSkillsSkillDiceCard
                      .neUdalosRasschitatZnachenieNavyka,
                },
              )}
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
            {disabledReason ??
              localizedContent.copy.characterDetailSkillsSkillDiceCard
                .neUdalosRasschitatZnachenieNavyka}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <CharacterSheetStatButton
          aria-label={formatLocalizedTemplate(
            localizedContent.copy.characterDetailSkillsSkillDiceCard
              .brositNavykValue0,
            { value0: label },
          )}
          className="relative grid h-full w-full grid-cols-[minmax(0,1fr)_auto] text-left"
          disabled={rolling}
          onClick={() => onRoll("normal")}
          type="button"
        >
          {content}
          {rolling ? <DiceRollProgressOverlay /> : null}
        </CharacterSheetStatButton>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>
          {localizedContent.copy.characterDetailSkillsSkillDiceCard.broski}
        </ContextMenuLabel>
        <ContextMenuItem disabled={rolling} onSelect={() => onRoll("normal")}>
          {
            localizedContent.copy.characterDetailSkillsSkillDiceCard
              .obychnyiBrosok
          }
        </ContextMenuItem>
        <ContextMenuItem
          className="text-[var(--ml-accent-success)] focus:bg-[color-mix(in_srgb,var(--ml-accent-success)_18%,transparent)] focus:text-[var(--ml-ink-primary)]"
          disabled={rolling}
          onSelect={() => onRoll("bonus")}
        >
          {
            localizedContent.copy.characterDetailSkillsSkillDiceCard
              .brosokSPreimuschestvom
          }
        </ContextMenuItem>
        <ContextMenuItem
          className="text-[var(--ml-accent-danger)] focus:bg-[color-mix(in_srgb,var(--ml-accent-danger)_18%,transparent)] focus:text-[var(--ml-ink-primary)]"
          disabled={rolling}
          onSelect={() => onRoll("penalty")}
        >
          {
            localizedContent.copy.characterDetailSkillsSkillDiceCard
              .brosokSPomehoi
          }
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
