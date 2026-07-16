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

export type CharacterRecordMeta = {
  id: string | null
  character_id?: string | null
  created_at: string | null
  updated_at: string | null
}

export type CharacterCharacteristics = CharacterRecordMeta & {
  strength: number | null
  constitution: number | null
  size: number | null
  dexterity: number | null
  appearance: number | null
  intelligence: number | null
  power: number | null
  education: number | null
}

export type CharacterDerivedStats = CharacterRecordMeta & {
  speed: number | null
  physique: number | null
  damage_bonus: string | null
  dodge_value: number | null
}

export type CharacterHealth = CharacterRecordMeta & {
  max_hp: number
  current_hp: number
  major_wound: boolean
  unconscious: boolean
  dying: boolean
  dead: boolean
}

export type CharacterMagic = CharacterRecordMeta & {
  max_mp: number
  current_mp: number
}

export type CharacterSanity = CharacterRecordMeta & {
  max_sanity: number
  current_sanity: number
  temp_insanity: boolean
  indef_insanity: boolean
}

export type CharacterLuck = CharacterRecordMeta & {
  starting_luck: number
  current_luck: number
}

export type CharacterSkillSpecialty = {
  id: string
  name: string
  description: string
  base_value: number
  created_at: string
  updated_at: string
}

export type CharacterSkill = {
  id: string
  name: string
  base_value: number
  value: number
  checked: boolean
  category: string
  specialized: boolean
  specialty: CharacterSkillSpecialty | null
  created_at: string
  updated_at: string
}

export type CharacterBackstoryItem = {
  id: string
  section: string
  title: string
  text: string
  created_at: string
  updated_at: string
}

export type CharacterBackstory = CharacterRecordMeta & {
  personal_description: string | null
  items: CharacterBackstoryItem[] | null
}

export type CharacterFinances = CharacterRecordMeta & {
  spending_limit: string | null
  cash: string | null
  assets: string | null
  credit_rating?: CharacterSkill | null
}

export type CharacterNote = CharacterRecordMeta & {
  title: string
  body: string
}

export type CharacterDetail = {
  id: string
  user_id: string
  name: string
  occupation: string | null
  age: number | null
  sex: string | null
  residence: string | null
  birthplace: string | null
  portrait_url: string | null
  created_at: string
  updated_at: string
  skills: CharacterSkill[] | null
  characteristics: CharacterCharacteristics
  derived_stats: CharacterDerivedStats
  hp: CharacterHealth
  mp: CharacterMagic
  sanity: CharacterSanity
  luck: CharacterLuck
  backstory: CharacterBackstory
  finances: CharacterFinances
  notes: CharacterNote[] | null
}

export type PortraitKind = "male" | "female"
