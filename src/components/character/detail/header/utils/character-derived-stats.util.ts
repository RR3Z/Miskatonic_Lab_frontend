import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import type { CharacterDetail } from "@/types/character.types"

export type DerivedStatDefinition = {
  key: "speed" | "physique" | "damage_bonus" | "dodge_value"
  label: string
  value: number | string | null
}

export function getCharacterDerivedStats(
  character: CharacterDetail,
): DerivedStatDefinition[] {
  return [
    {
      key: "speed",
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterDerivedStatDefinitions.skorost,
      value: character.derived_stats.speed,
    },
    {
      key: "physique",
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterDerivedStatDefinitions.komplektsiya,
      value: character.derived_stats.physique,
    },
    {
      key: "damage_bonus",
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterDerivedStatDefinitions.bonusUrona,
      value: character.derived_stats.damage_bonus,
    },
    {
      key: "dodge_value",
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterDerivedStatDefinitions.uklonenie,
      value: character.derived_stats.dodge_value,
    },
  ]
}
