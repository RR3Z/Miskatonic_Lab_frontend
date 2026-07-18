import type { ZodType } from "zod"

import {
  characterFinanceAssetsSchema,
  characterFinanceMoneySchema,
} from "@/dto/character/character-finances.dto"

type CharacterFinanceTextField = {
  className: string
  key: "assets" | "cash" | "spending_limit"
  label: string
  multiline: boolean
  placeholder: string
  schema: ZodType<string>
}

export const CHARACTER_FINANCE_FIELDS: CharacterFinanceTextField[] = [
  {
    className: "min-h-20",
    key: "spending_limit",
    label: "Карманные деньги",
    multiline: false,
    placeholder: "Добавить лимит расходов",
    schema: characterFinanceMoneySchema,
  },
  {
    className: "min-h-20",
    key: "cash",
    label: "Наличные",
    multiline: false,
    placeholder: "Добавить наличные",
    schema: characterFinanceMoneySchema,
  },
  {
    className: "col-span-2 min-h-32",
    key: "assets",
    label: "Активы",
    multiline: true,
    placeholder: "Добавить активы",
    schema: characterFinanceAssetsSchema,
  },
]
