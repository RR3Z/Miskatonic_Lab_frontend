import type {
  CompactStatDefinition,
  ResourceStatDefinition,
} from "@/components/character/detail/header/character-stat-types"
import type { CharacterDetail } from "@/types/character"

export function getCharacterCharacteristics(
  character: CharacterDetail,
): CompactStatDefinition[] {
  return [
    ["СИЛ", "Сила", character.characteristics.strength],
    ["ВЫН", "Выносливость", character.characteristics.constitution],
    ["ТЕЛ", "Телосложение", character.characteristics.size],
    ["ЛВК", "Ловкость", character.characteristics.dexterity],
    ["НАР", "Наружность", character.characteristics.appearance],
    ["ИНТ", "Интеллект", character.characteristics.intelligence],
    ["МОЩ", "Мощь", character.characteristics.power],
    ["ОБР", "Образование", character.characteristics.education],
  ]
}

export function getCharacterDerivedStats(
  character: CharacterDetail,
): CompactStatDefinition[] {
  return [
    ["Скорость", undefined, character.derived_stats.speed],
    ["Комплекция", undefined, character.derived_stats.physique],
    ["Бонус урона", undefined, character.derived_stats.damage_bonus],
    ["Уклонение", undefined, character.derived_stats.dodge_value],
  ]
}

export function getCharacterResources(
  character: CharacterDetail,
): ResourceStatDefinition[] {
  return [
    {
      current: character.hp.current_hp,
      label: "Здоровье",
      max: character.hp.max_hp,
      tone: "danger",
      visualKey: "health",
    },
    {
      current: character.sanity.current_sanity,
      label: "Рассудок",
      max: character.sanity.max_sanity,
      tone: "sanity",
      visualKey: "sanity",
    },
    {
      current: character.mp.current_mp,
      label: "Магия",
      max: character.mp.max_mp,
      tone: "magic",
      visualKey: "magic",
    },
    {
      current: character.luck.current_luck,
      label: "Удача",
      max: character.luck.starting_luck,
      tone: "luck",
      visualKey: "luck",
    },
  ]
}
