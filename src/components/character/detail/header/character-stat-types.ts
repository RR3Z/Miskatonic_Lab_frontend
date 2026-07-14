import type { ZodType } from "zod"
import type { CharacterStatVisualKey } from "@/components/character/character-stat-visuals"
import type {
  CharacterResourceKey,
  UpdateCharacterCharacteristicsDto,
  UpdateCharacterDerivedStatsDto,
} from "@/dto/character/character-sheet-values.dto"

export type CompactStatDefinition = {
  key:
    | keyof UpdateCharacterCharacteristicsDto
    | keyof UpdateCharacterDerivedStatsDto
  label: string
  schema: ZodType<string>
  title?: string
  value: number | string | null
}

export type ResourceStatDefinition = {
  current: number
  currentField: string
  label: string
  max: number
  maxField: string
  resource: CharacterResourceKey
  tone: "danger" | "magic" | "sanity" | "luck"
  visualKey: CharacterStatVisualKey
}
