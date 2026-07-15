import type { CompactStatDefinition } from "@/components/character/detail/header/character-stat-types"
import {
  characterNullableIntegerTextSchema,
  type UpdateCharacterCharacteristicsDto,
} from "@/dto/character/character-sheet-values.dto"
import type { CharacterDetail } from "@/types/character"

export type CharacteristicDefinition = Omit<
  CompactStatDefinition,
  "key" | "value"
> & {
  key: keyof UpdateCharacterCharacteristicsDto
  value: number | null
}

export function getCharacterCharacteristics(
  character: CharacterDetail,
): CharacteristicDefinition[] {
  return [
    {
      key: "strength",
      label: "СИЛ",
      schema: characterNullableIntegerTextSchema,
      title: "Сила",
      value: character.characteristics.strength,
    },
    {
      key: "constitution",
      label: "ВЫН",
      schema: characterNullableIntegerTextSchema,
      title: "Выносливость",
      value: character.characteristics.constitution,
    },
    {
      key: "size",
      label: "ТЕЛ",
      schema: characterNullableIntegerTextSchema,
      title: "Телосложение",
      value: character.characteristics.size,
    },
    {
      key: "dexterity",
      label: "ЛВК",
      schema: characterNullableIntegerTextSchema,
      title: "Ловкость",
      value: character.characteristics.dexterity,
    },
    {
      key: "appearance",
      label: "НАР",
      schema: characterNullableIntegerTextSchema,
      title: "Наружность",
      value: character.characteristics.appearance,
    },
    {
      key: "intelligence",
      label: "ИНТ",
      schema: characterNullableIntegerTextSchema,
      title: "Интеллект",
      value: character.characteristics.intelligence,
    },
    {
      key: "power",
      label: "МОЩ",
      schema: characterNullableIntegerTextSchema,
      title: "Мощь",
      value: character.characteristics.power,
    },
    {
      key: "education",
      label: "ОБР",
      schema: characterNullableIntegerTextSchema,
      title: "Образование",
      value: character.characteristics.education,
    },
  ]
}
