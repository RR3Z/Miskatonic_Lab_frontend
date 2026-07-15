import type { CharacterDetail } from "@/types/character"

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
      label: "Скорость",
      value: character.derived_stats.speed,
    },
    {
      key: "physique",
      label: "Комплекция",
      value: character.derived_stats.physique,
    },
    {
      key: "damage_bonus",
      label: "Бонус урона",
      value: character.derived_stats.damage_bonus,
    },
    {
      key: "dodge_value",
      label: "Уклонение",
      value: character.derived_stats.dodge_value,
    },
  ]
}
