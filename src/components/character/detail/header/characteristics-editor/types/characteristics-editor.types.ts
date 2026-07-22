import type { UpdateCharacterCharacteristicsDto } from "@/dto/character/character-sheet-values.dto"

export type CharacteristicFormInput = Record<
  keyof UpdateCharacterCharacteristicsDto,
  string
>
