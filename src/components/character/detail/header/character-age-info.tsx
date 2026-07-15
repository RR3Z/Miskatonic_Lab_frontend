import { Info } from "lucide-react"

import {
  CHARACTER_AGE_IMPROVEMENT_RULE,
  CHARACTER_AGE_RULES,
} from "@/components/character/detail/header/character-age-rules"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function CharacterAgeInfo() {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label="Информация о возрастных модификаторах"
            className="grid size-4 shrink-0 place-items-center rounded-sm text-[var(--ml-ink-muted)] opacity-75 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-[var(--ml-focus-ring)]"
            data-testid="character-age-info"
            type="button"
          >
            <Info aria-hidden="true" className="size-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          className="flex max-h-[min(32rem,var(--radix-tooltip-content-available-height))] max-w-sm flex-col items-start gap-2 overflow-y-auto border border-[#5d5231] bg-[#171411] p-3 text-left text-[#d9d2c5] shadow-[0_14px_40px_rgba(0,0,0,0.55)] [&>span>svg]:bg-[#171411] [&>span>svg]:fill-[#171411]"
          side="bottom"
          sideOffset={6}
        >
          <p className="font-heading text-base font-semibold">
            Возраст: модификаторы
          </p>
          <dl className="space-y-2 text-xs leading-relaxed">
            {CHARACTER_AGE_RULES.map((rule) => (
              <div key={rule.age}>
                <dt className="font-semibold text-[#e8d9b4]">{rule.age}</dt>
                <dd>{rule.modifiers}</dd>
              </div>
            ))}
          </dl>
          <p className="border-t border-[#5d5231]/70 pt-2 text-xs leading-relaxed">
            {CHARACTER_AGE_IMPROVEMENT_RULE}
          </p>
          <p className="text-xs leading-relaxed text-[#e8d9b4]">
            Система не применяет возрастные модификаторы автоматически. Игрок
            изменяет характеристики, ОБР, Удачу и СКО вручную.
          </p>
          <p className="text-xs opacity-70">Книга хранителя, стр. 32</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
