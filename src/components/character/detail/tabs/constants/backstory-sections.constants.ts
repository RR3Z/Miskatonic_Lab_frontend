import localizedContent from "@/data/locales/ru/character/detail.ru.json"
export const BACKSTORY_SECTIONS = [
  {
    key: "description",
    label: localizedContent.copy.characterDetailTabsBackstorySections.opisanie,
  },
  {
    key: "traits",
    label: localizedContent.copy.characterDetailTabsBackstorySections.cherty,
  },
  {
    key: "ideology_beliefs",
    label:
      localizedContent.copy.characterDetailTabsBackstorySections
        .idealyIPrintsipy,
  },
  {
    key: "injuries_scars",
    label:
      localizedContent.copy.characterDetailTabsBackstorySections.travmyIShramy,
  },
  {
    key: "significant_people",
    label:
      localizedContent.copy.characterDetailTabsBackstorySections.znachimyeLyudi,
  },
  {
    key: "phobias_manias",
    label:
      localizedContent.copy.characterDetailTabsBackstorySections.fobiiIManii,
  },
  {
    key: "meaningful_locations",
    label:
      localizedContent.copy.characterDetailTabsBackstorySections.vazhnyeMesta,
  },
  {
    key: "arcane_tomes_spells",
    label:
      localizedContent.copy.characterDetailTabsBackstorySections
        .magicheskieKnigiZaklinaniyaArtefakty,
  },
  {
    key: "treasured_possessions",
    label:
      localizedContent.copy.characterDetailTabsBackstorySections
        .tsennoeImuschestvo,
  },
  {
    key: "encounters",
    label:
      localizedContent.copy.characterDetailTabsBackstorySections
        .vstrechiSoSverhestestvennym,
  },
] as const

export type BackstorySection = (typeof BACKSTORY_SECTIONS)[number]
