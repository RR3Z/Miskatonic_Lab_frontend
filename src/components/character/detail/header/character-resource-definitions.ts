import type { ResourceStatDefinition } from "@/components/character/detail/header/character-stat-types"
import type { CharacterDetail } from "@/types/character"

export function getCharacterResources(
  character: CharacterDetail,
): ResourceStatDefinition[] {
  return [
    {
      current: character.hp.current_hp,
      currentField: "current_hp",
      label: "Здоровье",
      max: character.hp.max_hp,
      maxField: "max_hp",
      resource: "hp",
      tone: "danger",
      visualKey: "health",
    },
    {
      current: character.sanity.current_sanity,
      currentField: "current_sanity",
      label: "Рассудок",
      max: character.sanity.max_sanity,
      maxField: "max_sanity",
      resource: "sanity",
      tone: "sanity",
      visualKey: "sanity",
    },
    {
      current: character.mp.current_mp,
      currentField: "current_mp",
      label: "Магия",
      max: character.mp.max_mp,
      maxField: "max_mp",
      resource: "mp",
      tone: "magic",
      visualKey: "magic",
    },
    {
      current: character.luck.current_luck,
      currentField: "current_luck",
      label: "Удача",
      max: character.luck.starting_luck,
      maxField: "starting_luck",
      resource: "luck",
      tone: "luck",
      visualKey: "luck",
    },
  ]
}
