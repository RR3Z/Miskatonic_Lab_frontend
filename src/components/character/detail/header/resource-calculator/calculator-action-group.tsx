import type { ReactNode } from "react"
import { CharacterInfoTooltip } from "@/components/character/detail/character-info-tooltip"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"

type CalculatorActionGroupProps = {
  children: ReactNode
  description?: string
  title: string
}

export function CalculatorActionGroup({
  children,
  description,
  title,
}: CalculatorActionGroupProps) {
  return (
    <div className="rounded-sm border border-[var(--ml-border-aged)]/85 bg-[linear-gradient(135deg,rgba(63,51,34,0.55),rgba(25,22,18,0.82))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.09em] text-[var(--ml-accent-aged-gold)]">
          {title}
        </p>
        {description ? (
          <CharacterInfoTooltip
            ariaLabel={formatLocalizedTemplate(
              localizedContent.copy
                .detailHeaderResourceCalculatorCalculatorActionGroup
                .spravkaValue0,
              { value0: title },
            )}
            contentClassName="max-w-72"
            iconClassName="size-3.5"
            side="top"
            triggerClassName="size-5 cursor-pointer text-[var(--ml-ink-muted)] hover:text-[var(--ml-accent-aged-gold)]"
          >
            {description}
          </CharacterInfoTooltip>
        ) : null}
      </div>
      {children}
    </div>
  )
}
