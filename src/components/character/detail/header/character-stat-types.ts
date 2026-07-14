import type { CharacterStatVisualKey } from "@/components/character/character-stat-visuals"

export type CompactStatDefinition = readonly [
  label: string,
  title: string | undefined,
  value: number | string | null,
]

export type ResourceStatDefinition = {
  current: number
  label: string
  max: number
  tone: "danger" | "magic" | "sanity" | "luck"
  visualKey: CharacterStatVisualKey
}
