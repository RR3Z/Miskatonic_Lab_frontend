import localizedContent from "@/data/locales/ru/character/detail.ru.json"
export const CHARACTER_SHEET_TABS = [
  {
    label: localizedContent.copy.characterDetailTabsTabDefinitions.biografiya,
    value: "biography",
  },
  {
    label: localizedContent.copy.characterDetailTabsTabDefinitions.finansy,
    value: "finances",
  },
  {
    label: localizedContent.copy.characterDetailTabsTabDefinitions.inventar,
    value: "inventory",
  },
  {
    label: localizedContent.copy.characterDetailTabsTabDefinitions.zametki,
    value: "notes",
  },
  {
    label:
      localizedContent.copy.characterDetailTabsTabDefinitions.oruzhieIAtaki,
    value: "weapons",
  },
] as const
