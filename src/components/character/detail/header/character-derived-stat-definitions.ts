import type { CompactStatDefinition } from "@/components/character/detail/header/character-stat-types"
import {
  characterDamageBonusSchema,
  characterIntegerTextSchema,
} from "@/dto/character/character-sheet-values.dto"
import type { CharacterDetail } from "@/types/character"

export function getCharacterDerivedStats(
  character: CharacterDetail,
): CompactStatDefinition[] {
  return [
    {
      key: "speed",
      label: "Скорость",
      schema: characterIntegerTextSchema,
      value: character.derived_stats.speed,
    },
    {
      key: "physique",
      label: "Комплекция",
      schema: characterIntegerTextSchema,
      value: character.derived_stats.physique,
    },
    {
      key: "damage_bonus",
      label: "Бонус урона",
      schema: characterDamageBonusSchema,
      value: character.derived_stats.damage_bonus,
    },
    {
      key: "dodge_value",
      label: "Уклонение",
      schema: characterIntegerTextSchema,
      value: character.derived_stats.dodge_value,
    },
  ]
}
