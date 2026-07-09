import type { KyInstance } from "ky"
import type {
  CharacterApiListItem,
  CharacterApiLuckValue,
  CharacterApiStatValue,
  CharacterListItem,
  CharacterLuckValue,
  CharacterStatValue,
} from "@/types/character"

export async function fetchCharacters(
  api: KyInstance,
): Promise<CharacterListItem[]> {
  const characters = await api
    .get("api/characters/")
    .json<CharacterApiListItem[]>()

  return characters.map(normalizeCharacterListItem)
}

export function normalizeCharacterListItem(
  character: CharacterApiListItem,
): CharacterListItem {
  return {
    ...character,
    hp: normalizeStat(character.hp, "current_hp", "max_hp"),
    mp: normalizeStat(character.mp, "current_mp", "max_mp"),
    sanity: normalizeStat(character.sanity, "current_sanity", "max_sanity"),
    luck: normalizeLuck(character.luck),
  }
}

function normalizeStat(
  value: CharacterApiStatValue | null,
  currentKey: keyof CharacterApiStatValue,
  maxKey: keyof CharacterApiStatValue,
): CharacterStatValue {
  return {
    current: Number(value?.[currentKey] ?? value?.current ?? 0),
    max: Number(value?.[maxKey] ?? value?.max ?? 0),
  }
}

function normalizeLuck(
  value: CharacterApiLuckValue | null,
): CharacterLuckValue {
  return {
    current: Number(value?.current_luck ?? value?.current ?? 0),
    starting: Number(value?.starting_luck ?? value?.starting ?? 0),
  }
}
