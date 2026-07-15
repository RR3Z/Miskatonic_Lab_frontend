import { Info } from "lucide-react"
import { CharacterSheetTooltip } from "@/components/character/detail/character-sheet-tooltip"
import type { CharacterStateRule } from "@/components/character/detail/character-state-rules"
import { CHARACTER_STATE_ACTIVE_CLASSES } from "@/components/character/detail/header/character-state-styles"
import type { CharacterStateTone } from "@/components/character/detail/header/character-state-types"
import { cn } from "@/lib/utils/cn.util"

export function CharacterState({
  active,
  disabled,
  onToggle,
  rule,
  testId,
  tone = "warning",
}: {
  active: boolean
  disabled: boolean
  onToggle: () => void
  rule: CharacterStateRule
  testId: string
  tone?: CharacterStateTone
}) {
  return (
    <div
      className={cn(
        "flex min-h-7 min-w-0 items-center gap-1 rounded-sm border font-body text-[0.68rem] leading-tight uppercase tracking-normal",
        active
          ? CHARACTER_STATE_ACTIVE_CLASSES[tone]
          : "border-[var(--ml-border-subtle)] text-[var(--ml-ink-muted)] opacity-60",
      )}
      data-active={active}
      data-testid={testId}
    >
      <button
        aria-pressed={active}
        className="flex min-w-0 flex-1 self-stretch cursor-pointer items-center px-2 py-1 text-left transition-colors hover:bg-[var(--ml-surface-panel-raised)]/45 focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ml-focus-ring)]"
        disabled={disabled}
        onClick={onToggle}
        type="button"
      >
        <span className="min-w-0 flex-1 whitespace-normal" title={rule.label}>
          {rule.label}
        </span>
      </button>
      <CharacterSheetTooltip
        trigger={
          <button
            aria-label={`Информация о состоянии: ${rule.label}`}
            className="mr-1 grid size-5 shrink-0 place-items-center rounded-sm text-current opacity-75 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-[var(--ml-focus-ring)]"
            type="button"
          >
            <Info aria-hidden="true" className="size-3.5" />
          </button>
        }
      >
        <p className="font-heading text-base font-semibold">{rule.label}</p>
        <p>{rule.description}</p>
        <p>
          <strong>Как получить:</strong> {rule.acquisition}
        </p>
        <p>
          <strong>Последствие:</strong> {rule.consequence}
        </p>
        <p className="text-xs opacity-70">{rule.source}</p>
      </CharacterSheetTooltip>
    </div>
  )
}
