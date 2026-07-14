import type { ZodType } from "zod"

import {
  characterFinanceAssetsSchema,
  characterFinanceMoneySchema,
} from "@/dto/character/character-finances.dto"

type CharacterFinanceTextField = {
  className: string
  key: "assets" | "cash" | "spending_limit"
  kind: "text"
  label: string
  multiline: boolean
  placeholder: string
  schema: ZodType<string>
}

type CharacterFinanceCreditField = {
  className: string
  key: "credit_rating"
  kind: "credit-rating"
  label: string
}

export type CharacterFinanceField =
  | CharacterFinanceTextField
  | CharacterFinanceCreditField

export const CHARACTER_FINANCE_FIELDS: CharacterFinanceField[] = [
  {
    className: "min-h-20",
    key: "spending_limit",
    kind: "text",
    label: "Карманные деньги",
    multiline: false,
    placeholder: "Добавить лимит расходов",
    schema: characterFinanceMoneySchema,
  },
  {
    className: "min-h-20",
    key: "cash",
    kind: "text",
    label: "Наличные",
    multiline: false,
    placeholder: "Добавить наличные",
    schema: characterFinanceMoneySchema,
  },
  {
    className: "col-span-2 min-h-20",
    key: "credit_rating",
    kind: "credit-rating",
    label: "Кредитный рейтинг",
  },
  {
    className: "col-span-2 min-h-32",
    key: "assets",
    kind: "text",
    label: "Активы",
    multiline: true,
    placeholder: "Добавить активы",
    schema: characterFinanceAssetsSchema,
  },
]
