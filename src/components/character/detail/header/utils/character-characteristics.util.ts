import type { CompactStatDefinition } from "@/components/character/detail/header/types/character-stat.types"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import {
  characterNullableIntegerTextSchema,
  type UpdateCharacterCharacteristicsDto,
} from "@/dto/character/character-sheet-values.dto"
import type { CharacterDetail } from "@/types/character.types"

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
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.sil,
      schema: characterNullableIntegerTextSchema,
      title:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.sila,
      value: character.characteristics.strength,
    },
    {
      key: "constitution",
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.vyn,
      schema: characterNullableIntegerTextSchema,
      title:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.vynoslivost,
      value: character.characteristics.constitution,
    },
    {
      key: "size",
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.tel,
      schema: characterNullableIntegerTextSchema,
      title:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions
          .teloslozhenie,
      value: character.characteristics.size,
    },
    {
      key: "dexterity",
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.lvk,
      schema: characterNullableIntegerTextSchema,
      title:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.lovkost,
      value: character.characteristics.dexterity,
    },
    {
      key: "appearance",
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.nar,
      schema: characterNullableIntegerTextSchema,
      title:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.naruzhnost,
      value: character.characteristics.appearance,
    },
    {
      key: "intelligence",
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.int,
      schema: characterNullableIntegerTextSchema,
      title:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.intellekt,
      value: character.characteristics.intelligence,
    },
    {
      key: "power",
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.mosch,
      schema: characterNullableIntegerTextSchema,
      title:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.mosch2,
      value: character.characteristics.power,
    },
    {
      key: "education",
      label:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.obr,
      schema: characterNullableIntegerTextSchema,
      title:
        localizedContent.copy
          .characterDetailHeaderCharacterCharacteristicDefinitions.obrazovanie,
      value: character.characteristics.education,
    },
  ]
}
