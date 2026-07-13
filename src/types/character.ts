export type CharacterStatValue = {
  current: number
  max: number
}

export type CharacterLuckValue = {
  current: number
  starting: number
}

export type CharacterApiStatValue = {
  current?: number | null
  max?: number | null
  current_hp?: number | null
  max_hp?: number | null
  current_mp?: number | null
  max_mp?: number | null
  current_sanity?: number | null
  max_sanity?: number | null
}

export type CharacterApiLuckValue = {
  current?: number | null
  starting?: number | null
  current_luck?: number | null
  starting_luck?: number | null
}

export type CharacterApiListItem = {
  id: string
  name: string
  occupation: string | null
  age: number | null
  sex: string | null
  residence: string | null
  birthplace: string | null
  portrait_url: string | null
  created_at: string
  updated_at: string
  hp: CharacterApiStatValue | null
  mp: CharacterApiStatValue | null
  sanity: CharacterApiStatValue | null
  luck: CharacterApiLuckValue | null
}

export type CharacterListItem = {
  id: string
  name: string
  occupation: string | null
  age: number | null
  sex: string | null
  residence: string | null
  birthplace: string | null
  portrait_url: string | null
  created_at: string
  updated_at: string
  hp: CharacterStatValue
  mp: CharacterStatValue
  sanity: CharacterStatValue
  luck: CharacterLuckValue
}

export type CreatedCharacter = {
  id: string
  name: string
  age: number | null
  sex: string | null
  portrait_url: string | null
}

export type PortraitKind = "male" | "female"
