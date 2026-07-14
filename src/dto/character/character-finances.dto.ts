import { z } from "zod"

export const characterFinanceMoneySchema = z
  .string()
  .trim()
  .min(1, "Добавьте значение")
  .max(120, "Значение не должно превышать 120 символов")

export const characterFinanceAssetsSchema = z
  .string()
  .trim()
  .min(1, "Добавьте описание активов")

export type UpdateCharacterFinancesDto = {
  assets?: string
  cash?: string
  credit_rating_skill_id?: string
  spending_limit?: string
}
