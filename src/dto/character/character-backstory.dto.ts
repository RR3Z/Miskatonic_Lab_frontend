import { z } from "zod"

export const characterBackstorySectionSchema = z.enum([
  "traits",
  "ideology_beliefs",
  "injuries_scars",
  "significant_people",
  "phobias_manias",
  "meaningful_locations",
  "arcane_tomes_spells",
  "treasured_possessions",
  "encounters",
])

export const characterBackstoryTextSchema = z
  .string()
  .trim()
  .min(1, "Добавьте текст раздела")

export const characterBackstoryItemSchema = z.object({
  section: characterBackstorySectionSchema,
  title: z.string().trim().min(1).max(120),
  text: characterBackstoryTextSchema,
})

export type CharacterBackstorySectionKey = z.infer<
  typeof characterBackstorySectionSchema
>
export type CharacterBackstoryItemDto = z.output<
  typeof characterBackstoryItemSchema
>
export type UpsertCharacterBackstoryDto = {
  personal_description: string | null
}
