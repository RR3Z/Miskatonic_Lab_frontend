import { CharacterInfoTooltip } from "@/components/character/detail/character-info-tooltip"
import {
  CHARACTER_AGE_IMPROVEMENT_RULE,
  CHARACTER_AGE_RULES,
} from "@/components/character/detail/header/constants/character-age-rules.constants"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

export function CharacterAgeInfo() {
  return (
    <CharacterInfoTooltip
      ariaLabel={
        localizedContent.copy.characterDetailHeaderCharacterAgeInfo
          .informatsiyaOVozrastnyhModifikatorah
      }
      contentClassName="w-[min(24rem,calc(100vw-2rem))] max-w-none p-0"
      iconClassName="size-3"
      scrollAreaClassName="max-h-[min(32rem,var(--radix-tooltip-content-available-height))] [&_[data-slot=scroll-area-scrollbar]]:border-l-[#5d5231]/70 [&_[data-slot=scroll-area-thumb]]:bg-[#b6a367]/70 [&_[data-slot=scroll-area-thumb]]:hover:bg-[#e8d9b4]"
      scrollable
      testId="character-age-info"
      triggerClassName="size-4 text-[var(--ml-ink-muted)]"
    >
      <div className="flex flex-col items-start gap-2 p-3 pr-4">
        <p className="font-heading text-base font-semibold">
          {
            localizedContent.copy.characterDetailHeaderCharacterAgeInfo
              .vozrastModifikatory
          }
        </p>
        <dl className="space-y-2 text-sm leading-relaxed">
          {CHARACTER_AGE_RULES.map((rule) => (
            <div key={rule.age}>
              <dt className="font-semibold text-[#e8d9b4]">{rule.age}</dt>
              <dd>{rule.modifiers}</dd>
            </div>
          ))}
        </dl>
        <p className="border-t border-[#5d5231]/70 pt-2 text-sm leading-relaxed">
          {CHARACTER_AGE_IMPROVEMENT_RULE}
        </p>
        <p className="text-sm leading-relaxed text-[#e8d9b4]">
          {
            localizedContent.copy.characterDetailHeaderCharacterAgeInfo
              .sistemaNePrimenyaetVozrastnyeModifikatoryAvtomaticheski
          }
        </p>
        <p className="text-xs opacity-70">
          {
            localizedContent.copy.characterDetailHeaderCharacterAgeInfo
              .knigaHranitelyaStr32
          }
        </p>
      </div>
    </CharacterInfoTooltip>
  )
}
