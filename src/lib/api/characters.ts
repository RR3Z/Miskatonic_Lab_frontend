import type { KyInstance } from "ky"
import type {
  CreateCharacterFormDto,
  CreateCharacterPayload,
} from "@/dto/character/create-character.dto"
import type {
  CharacterApiListItem,
  CharacterApiLuckValue,
  CharacterApiStatValue,
  CharacterDetail,
  CharacterListItem,
  CharacterLuckValue,
  CharacterStatValue,
  CreatedCharacter,
} from "@/types/character"

export type CreateCharacterResult = {
  character: CreatedCharacter
  portraitStatus: "not_requested" | "uploaded" | "failed"
}

export async function fetchCharacters(
  api: KyInstance,
): Promise<CharacterListItem[]> {
  const characters = await api
    .get("api/characters/")
    .json<CharacterApiListItem[]>()

  return characters.map(normalizeCharacterListItem)
}

export async function fetchCharacter(
  api: KyInstance,
  characterId: string,
): Promise<CharacterDetail> {
  return api.get(`api/characters/${characterId}/`).json<CharacterDetail>()
}

export async function deleteCharacter(
  api: KyInstance,
  characterId: string,
): Promise<void> {
  await api.delete(`api/characters/${characterId}/`)
}

export async function createCharacter(
  api: KyInstance,
  input: CreateCharacterPayload,
): Promise<CreatedCharacter> {
  return api
    .post("api/characters/", {
      json: { name: input.name, age: input.age, sex: input.sex },
    })
    .json<CreatedCharacter>()
}

export async function uploadCharacterPortrait(
  api: KyInstance,
  characterId: string,
  portrait: File,
): Promise<CreatedCharacter> {
  const body = new FormData()
  body.set("portrait", portrait)

  return api
    .patch(`api/characters/${characterId}/`, { body })
    .json<CreatedCharacter>()
}

export async function createCharacterWithPortrait(
  api: KyInstance,
  input: CreateCharacterFormDto,
): Promise<CreateCharacterResult> {
  const character = await createCharacter(api, input)

  if (!input.portrait) {
    return { character, portraitStatus: "not_requested" }
  }

  try {
    const uploadedCharacter = await uploadCharacterPortrait(
      api,
      character.id,
      input.portrait,
    )
    return { character: uploadedCharacter, portraitStatus: "uploaded" }
  } catch {
    return { character, portraitStatus: "failed" }
  }
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
