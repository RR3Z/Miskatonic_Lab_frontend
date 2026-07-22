import localizedContent from "@/data/locales/ru/character/detail.ru.json"
export const CHARACTER_AGE_RULES = [
  {
    age: "15–19",
    modifiers:
      localizedContent.copy.characterDetailHeaderCharacterAgeRules
        .vychtiteSummarno5IzSilI,
  },
  {
    age: "20–39",
    modifiers:
      localizedContent.copy.characterDetailHeaderCharacterAgeRules
        .vypolniteProverkuUluchsheniyaObr,
  },
  {
    age: "40–49",
    modifiers:
      localizedContent.copy.characterDetailHeaderCharacterAgeRules
        .vychtiteSummarno5IzSilVyn,
  },
  {
    age: "50–59",
    modifiers:
      localizedContent.copy.characterDetailHeaderCharacterAgeRules
        .vychtiteSummarno10IzSilVyn,
  },
  {
    age: "60–69",
    modifiers:
      localizedContent.copy.characterDetailHeaderCharacterAgeRules
        .vychtiteSummarno20IzSilVyn,
  },
  {
    age: "70–79",
    modifiers:
      localizedContent.copy.characterDetailHeaderCharacterAgeRules
        .vychtiteSummarno40IzSilVyn,
  },
  {
    age: "80–89",
    modifiers:
      localizedContent.copy.characterDetailHeaderCharacterAgeRules
        .vychtiteSummarno80IzSilVyn,
  },
] as const

export const CHARACTER_AGE_IMPROVEMENT_RULE =
  localizedContent.copy.characterDetailHeaderCharacterAgeRules
    .proverkaUluchsheniyaObrBroste1d100Esli
