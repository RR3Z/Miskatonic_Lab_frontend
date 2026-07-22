export type CharacterStateRuleKey =
  | "majorWound"
  | "unconscious"
  | "dying"
  | "dead"
  | "temporaryInsanity"
  | "indefiniteInsanity"

export type CharacterStateRule = {
  acquisition: string
  consequence: string
  description: string
  label: string
  source: string
}
