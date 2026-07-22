import type { KyInstance } from "ky"

import type {
  CharacterBackstoryItemDto,
  UpsertCharacterBackstoryDto,
} from "@/dto/character/character-backstory.dto"
import type {
  CharacterBackstory,
  CharacterBackstoryItem,
} from "@/types/character.types"

export async function upsertCharacterBackstory(
  api: KyInstance,
  characterId: string,
  input: UpsertCharacterBackstoryDto,
): Promise<CharacterBackstory> {
  return api
    .put(`api/characters/${characterId}/backstory/`, { json: input })
    .json<CharacterBackstory>()
}

export async function deleteCharacterBackstory(
  api: KyInstance,
  characterId: string,
): Promise<void> {
  await api.delete(`api/characters/${characterId}/backstory/`)
}

export async function createCharacterBackstoryItem(
  api: KyInstance,
  characterId: string,
  input: CharacterBackstoryItemDto,
): Promise<CharacterBackstoryItem> {
  await upsertCharacterBackstory(api, characterId, {
    personal_description: null,
  })

  return api
    .post(`api/characters/${characterId}/backstory/items/`, { json: input })
    .json<CharacterBackstoryItem>()
}

export async function updateCharacterBackstoryItem(
  api: KyInstance,
  characterId: string,
  itemId: string,
  input: CharacterBackstoryItemDto,
): Promise<CharacterBackstoryItem> {
  return api
    .put(`api/characters/${characterId}/backstory/items/${itemId}/`, {
      json: input,
    })
    .json<CharacterBackstoryItem>()
}

export async function deleteCharacterBackstoryItem(
  api: KyInstance,
  characterId: string,
  itemId: string,
): Promise<void> {
  await api.delete(`api/characters/${characterId}/backstory/items/${itemId}/`)
}
