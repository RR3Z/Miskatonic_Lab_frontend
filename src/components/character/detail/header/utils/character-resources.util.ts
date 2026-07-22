import type { ResourceStatDefinition } from "@/components/character/detail/header/types/character-stat.types"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import type { CharacterDetail } from "@/types/character.types"

export function getCharacterResources(
  character: CharacterDetail,
): ResourceStatDefinition[] {
  return [
    {
      current: character.hp.current_hp,
      currentField: "current_hp",
      label:
        localizedContent.copy.characterDetailHeaderCharacterResourceDefinitions
          .zdorove,
      max: character.hp.max_hp,
      maxField: "max_hp",
      resource: "hp",
      tone: "danger",
      visualKey: "health",
    },
    {
      current: character.sanity.current_sanity,
      currentField: "current_sanity",
      label:
        localizedContent.copy.characterDetailHeaderCharacterResourceDefinitions
          .rassudok,
      max: character.sanity.max_sanity,
      maxField: "max_sanity",
      resource: "sanity",
      tone: "sanity",
      visualKey: "sanity",
    },
    {
      current: character.mp.current_mp,
      currentField: "current_mp",
      label:
        localizedContent.copy.characterDetailHeaderCharacterResourceDefinitions
          .magiya,
      max: character.mp.max_mp,
      maxField: "max_mp",
      resource: "mp",
      tone: "magic",
      visualKey: "magic",
    },
    {
      current: character.luck.current_luck,
      currentField: "current_luck",
      label:
        localizedContent.copy.characterDetailHeaderCharacterResourceDefinitions
          .udacha,
      max: character.luck.starting_luck,
      maxField: "starting_luck",
      resource: "luck",
      tone: "luck",
      visualKey: "luck",
    },
  ]
}
