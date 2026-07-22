import type { CharacterStateTone } from "@/components/character/detail/header/types/character-state.types"
import type { CharacterStateRuleKey } from "@/components/character/detail/types/character-state-rule.types"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

type CharacterStateDefinition = {
  backendField: string
  key: CharacterStateRuleKey
  resource: "hp" | "sanity"
  testId: string
  tone?: CharacterStateTone
}

type CharacterStateGroupDefinition = {
  gridClassName: string
  label: string
  states: CharacterStateDefinition[]
}

export const CHARACTER_STATE_GROUPS: CharacterStateGroupDefinition[] = [
  {
    gridClassName: "grid-cols-2",
    label:
      localizedContent.copy.characterDetailHeaderCharacterStateGroupDefinitions
        .zdorove,
    states: [
      {
        backendField: "major_wound",
        key: "majorWound",
        resource: "hp",
        testId: "character-state-major-wound",
      },
      {
        backendField: "unconscious",
        key: "unconscious",
        resource: "hp",
        testId: "character-state-unconscious",
      },
      {
        backendField: "dying",
        key: "dying",
        resource: "hp",
        testId: "character-state-dying",
        tone: "danger",
      },
      {
        backendField: "dead",
        key: "dead",
        resource: "hp",
        testId: "character-state-dead",
        tone: "danger",
      },
    ],
  },
  {
    gridClassName: "grid-cols-1",
    label:
      localizedContent.copy.characterDetailHeaderCharacterStateGroupDefinitions
        .rassudok,
    states: [
      {
        backendField: "temp_insanity",
        key: "temporaryInsanity",
        resource: "sanity",
        testId: "character-state-temporary-insanity",
        tone: "sanity",
      },
      {
        backendField: "indef_insanity",
        key: "indefiniteInsanity",
        resource: "sanity",
        testId: "character-state-indefinite-insanity",
        tone: "sanity",
      },
    ],
  },
]
