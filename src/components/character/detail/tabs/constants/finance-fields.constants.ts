import type { ZodType } from "zod"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

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
    label:
      localizedContent.copy.characterDetailTabsFinanceFieldDefinitions
        .karmannyeDengi,
    multiline: false,
    placeholder:
      localizedContent.copy.characterDetailTabsFinanceFieldDefinitions
        .dobavitLimitRashodov,
    schema: characterFinanceMoneySchema,
  },
  {
    className: "min-h-20",
    key: "cash",
    label:
      localizedContent.copy.characterDetailTabsFinanceFieldDefinitions
        .nalichnye,
    multiline: false,
    placeholder:
      localizedContent.copy.characterDetailTabsFinanceFieldDefinitions
        .dobavitNalichnye,
    schema: characterFinanceMoneySchema,
  },
  {
    className: "col-span-2 min-h-32",
    key: "assets",
    label:
      localizedContent.copy.characterDetailTabsFinanceFieldDefinitions.aktivy,
    multiline: true,
    placeholder:
      localizedContent.copy.characterDetailTabsFinanceFieldDefinitions
        .dobavitAktivy,
    schema: characterFinanceAssetsSchema,
  },
]
