import { CharacterInfoTooltip } from "@/components/character/detail/character-info-tooltip"
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
      <CharacterInfoTooltip
        ariaLabel={`Информация о состоянии: ${rule.label}`}
        iconClassName="size-3.5"
        triggerClassName="mr-1 size-5 text-current"
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
      </CharacterInfoTooltip>
    </div>
  )
}
