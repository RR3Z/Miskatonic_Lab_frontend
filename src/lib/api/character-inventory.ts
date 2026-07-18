import type { KyInstance } from "ky"

import type { CharacterInventoryItemDto } from "@/dto/character/character-inventory-item.dto"
import type { CharacterInventoryItem } from "@/types/character"

export async function createCharacterInventoryItem(
  api: KyInstance,
  characterId: string,
  input: CharacterInventoryItemDto,
): Promise<CharacterInventoryItem> {
  return api
    .post(`api/characters/${characterId}/inventory/`, { json: input })
    .json<CharacterInventoryItem>()
}

export async function updateCharacterInventoryItem(
  api: KyInstance,
  characterId: string,
  itemId: string,
  input: CharacterInventoryItemDto,
): Promise<CharacterInventoryItem> {
  return api
    .put(`api/characters/${characterId}/inventory/${itemId}/`, { json: input })
    .json<CharacterInventoryItem>()
}

export async function deleteCharacterInventoryItem(
  api: KyInstance,
  characterId: string,
  itemId: string,
): Promise<void> {
  await api.delete(`api/characters/${characterId}/inventory/${itemId}/`)
}
