import { z } from "zod"

export const MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH = 120
export const MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH = 80

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => value || undefined)

export const characterInventoryItemNameSchema = z
  .string()
  .trim()
  .min(1, "Укажите название предмета")
  .max(
    MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH,
    `Название не должно превышать ${MAX_CHARACTER_INVENTORY_ITEM_NAME_LENGTH} символов`,
  )

export const characterInventoryItemQuantitySchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : Number(value)))
  .pipe(
    z
      .number()
      .int("Количество должно быть целым числом")
      .min(1, "Количество должно быть не меньше 1")
      .optional(),
  )

export const characterInventoryItemCategorySchema = optionalTextSchema.refine(
  (value) =>
    value === undefined ||
    value.length <= MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH,
  `Категория не должна превышать ${MAX_CHARACTER_INVENTORY_ITEM_CATEGORY_LENGTH} символов`,
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
