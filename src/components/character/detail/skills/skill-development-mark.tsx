import { Check } from "lucide-react"

import { cn } from "@/lib/utils/cn.util"

export function SkillDevelopmentMark({ checked }: { checked: boolean }) {
  return (
    <span
      aria-label={checked ? "Отмечен для развития" : "Не отмечен для развития"}
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-[2px] border",
        checked
          ? "border-[var(--ml-accent-brass-strong)] bg-[var(--ml-accent-brass-strong)]/20 text-[var(--ml-accent-brass-strong)]"
          : "border-[var(--ml-border-aged)] text-transparent",
      )}
      role="img"
    >
      <Check aria-hidden="true" className="size-3" strokeWidth={2.5} />
    </span>
  )
}
