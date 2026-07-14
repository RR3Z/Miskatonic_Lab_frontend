import type { KyInstance } from "ky"

import type {
  CharacterResourceKey,
  CharacterResourceUpdate,
} from "@/dto/character/character-sheet-values.dto"
import { CHARACTER_RESOURCE_ENDPOINTS } from "@/lib/api/character-resource-endpoints"
import type {
  CharacterHealth,
  CharacterLuck,
  CharacterMagic,
  CharacterSanity,
} from "@/types/character"

export type UpdatedCharacterResource =
  | { resource: "hp"; value: CharacterHealth }
  | { resource: "luck"; value: CharacterLuck }
  | { resource: "mp"; value: CharacterMagic }
  | { resource: "sanity"; value: CharacterSanity }

export async function updateCharacterResource(
  api: KyInstance,
  characterId: string,
  input: CharacterResourceUpdate,
): Promise<UpdatedCharacterResource> {
  const response = api.put(
    `api/characters/${characterId}/${CHARACTER_RESOURCE_ENDPOINTS[input.resource]}/`,
    { json: input.values },
  )

  switch (input.resource) {
    case "hp":
      return { resource: "hp", value: await response.json<CharacterHealth>() }
    case "luck":
      return { resource: "luck", value: await response.json<CharacterLuck>() }
    case "mp":
      return { resource: "mp", value: await response.json<CharacterMagic>() }
    case "sanity":
      return {
        resource: "sanity",
        value: await response.json<CharacterSanity>(),
      }
  }
}

export async function deleteCharacterResource(
  api: KyInstance,
  characterId: string,
  resource: CharacterResourceKey,
): Promise<void> {
  await api.delete(
    `api/characters/${characterId}/${CHARACTER_RESOURCE_ENDPOINTS[resource]}/`,
  )
}
