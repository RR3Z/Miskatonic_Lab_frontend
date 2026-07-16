import { Check } from "lucide-react"

import { cn } from "@/lib/utils/cn.util"

export function SkillDevelopmentMark({
  checked,
  disabled,
  onToggle,
}: {
  checked: boolean
  disabled?: boolean
  onToggle: () => void
}) {
  return (
    <button
      aria-label={checked ? "Отмечен для развития" : "Не отмечен для развития"}
      aria-pressed={checked}
      className="group grid w-7 shrink-0 self-stretch cursor-pointer place-items-center rounded-sm hover:bg-[var(--ml-surface-panel-raised)]/45 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled}
      onClick={onToggle}
      type="button"
    >
      <span
        className={cn(
          "grid size-5 place-items-center rounded-[3px] border transition-colors group-focus-visible:ring-2 group-focus-visible:ring-[var(--ml-focus-ring)] group-focus-visible:ring-offset-1 group-focus-visible:ring-offset-[var(--ml-surface-panel)]",
          checked
            ? "border-[var(--ml-accent-brass-strong)] bg-[var(--ml-accent-brass-strong)]/20 text-[var(--ml-accent-brass-strong)]"
            : "border-[var(--ml-border-aged)] bg-[var(--ml-bg-page)]/20 text-transparent",
        )}
        data-testid="skill-development-checkbox"
      >
        <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
      </span>
    </button>
  )
}
