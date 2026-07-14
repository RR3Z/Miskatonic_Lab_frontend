import type { CharacterStateRuleKey } from "@/components/character/detail/character-state-rules"
import type { CharacterStateTone } from "@/components/character/detail/header/character-state-types"

type CharacterStateDefinition = {
  key: CharacterStateRuleKey
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
    label: "Здоровье",
    states: [
      { key: "majorWound", testId: "character-state-major-wound" },
      { key: "unconscious", testId: "character-state-unconscious" },
      {
        key: "dying",
        testId: "character-state-dying",
        tone: "danger",
      },
      { key: "dead", testId: "character-state-dead", tone: "danger" },
    ],
  },
  {
    gridClassName: "grid-cols-1",
    label: "Рассудок",
    states: [
      {
        key: "temporaryInsanity",
        testId: "character-state-temporary-insanity",
        tone: "sanity",
      },
      {
        key: "indefiniteInsanity",
        testId: "character-state-indefinite-insanity",
        tone: "sanity",
      },
    ],
  },
]
