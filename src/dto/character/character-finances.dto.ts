import { z } from "zod"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

export const characterFinanceMoneySchema = z
  .string()
  .trim()
  .min(
    1,
    localizedContent.copy.dtoCharacterCharacterFinancesDto.dobavteZnachenie,
  )
  .max(
    120,
    localizedContent.copy.dtoCharacterCharacterFinancesDto
      .znachenieNeDolzhnoPrevyshat120Simvolov,
  )

export const characterFinanceAssetsSchema = z
  .string()
  .trim()
  .min(
    1,
    localizedContent.copy.dtoCharacterCharacterFinancesDto
      .dobavteOpisanieAktivov,
  )

export type UpdateCharacterFinancesDto = {
  assets?: string
  cash?: string
  spending_limit?: string
}
