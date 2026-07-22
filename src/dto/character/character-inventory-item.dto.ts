import { z } from "zod"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"

export const MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH = 120
export const MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH = 80

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => value || undefined)

export const characterInventoryItemNameSchema = z
  .string()
  .trim()
  .min(
    1,
    localizedContent.copy.dtoCharacterCharacterInventoryItemDto
      .ukazhiteNazvaniePredmeta,
  )
  .max(
    MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH,
    formatLocalizedTemplate(
      localizedContent.copy.dtoCharacterCharacterInventoryItemDto
        .nazvanieNeDolzhnoPrevyshatValue0Simvolov,
      { value0: MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH },
    ),
  )

export const characterInventoryItemQuantitySchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : Number(value)))
  .pipe(
    z
      .number()
      .int(
        localizedContent.copy.dtoCharacterCharacterInventoryItemDto
          .kolichestvoDolzhnoBytTselymChislom,
      )
      .min(
        1,
        localizedContent.copy.dtoCharacterCharacterInventoryItemDto
          .kolichestvoDolzhnoBytNeMenshe1,
      )
      .optional(),
  )

export const characterInventoryItemCategorySchema = optionalTextSchema.refine(
  (value) =>
    value === undefined ||
    value.length <= MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH,
  formatLocalizedTemplate(
    localizedContent.copy.dtoCharacterCharacterInventoryItemDto
      .kategoriyaNeDolzhnaPrevyshatValue0Simvolov,
    { value0: MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH },
  ),
)

export const characterInventoryItemDescriptionSchema = optionalTextSchema

export const characterInventoryItemSchema = z.object({
  category: characterInventoryItemCategorySchema,
  description: characterInventoryItemDescriptionSchema,
  name: characterInventoryItemNameSchema,
  quantity: characterInventoryItemQuantitySchema,
})

export type CharacterInventoryItemInput = z.input<
  typeof characterInventoryItemSchema
>
export type CharacterInventoryItemDto = z.output<
  typeof characterInventoryItemSchema
>

export const characterInventoryItemDefaultValues: CharacterInventoryItemInput =
  {
    category: "",
    description: "",
    name: "",
    quantity: "",
  }
