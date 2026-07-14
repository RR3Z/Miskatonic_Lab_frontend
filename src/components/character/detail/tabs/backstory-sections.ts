export const BACKSTORY_SECTIONS = [
  { key: "description", label: "Описание" },
  { key: "traits", label: "Черты" },
  { key: "ideology_beliefs", label: "Идеалы и принципы" },
  { key: "injuries_scars", label: "Травмы и шрамы" },
  { key: "significant_people", label: "Значимые люди" },
  { key: "phobias_manias", label: "Фобии и мании" },
  { key: "meaningful_locations", label: "Важные места" },
  {
    key: "arcane_tomes_spells",
    label: "Магические книги, заклинания, артефакты",
  },
  { key: "treasured_possessions", label: "Ценное имущество" },
  { key: "encounters", label: "Встречи со сверхъестественным" },
] as const

export type BackstorySection = (typeof BACKSTORY_SECTIONS)[number]
