"use client"

import { useMutation } from "@tanstack/react-query"

import type { CharacterInventoryItemDto } from "@/dto/character/character-inventory-item.dto"
import {
  createCharacterInventoryItem,
  deleteCharacterInventoryItem,
  updateCharacterInventoryItem,
} from "@/lib/api/character-inventory"
import { useCharacterMutationContext } from "@/lib/api/use-character-mutation-context"

export function useCreateCharacterInventoryItem(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterInventoryItemDto) => {
      context.requireSession()
      return createCharacterInventoryItem(context.api, characterId, input)
    },
    onSuccess: (item) => {
      context.updateDetail((character) =>
        character
          ? { ...character, inventory: [item, ...(character.inventory ?? [])] }
          : character,
      )
      context.invalidateDetail()
    },
  })
}

export function useUpdateCharacterInventoryItem(
  characterId: string,
  itemId: string,
) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterInventoryItemDto) => {
      context.requireSession()
      return updateCharacterInventoryItem(
        context.api,
        characterId,
        itemId,
        input,
      )
    },
    onSuccess: (updatedItem) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              inventory: (character.inventory ?? []).map((item) =>
                item.id === itemId ? updatedItem : item,
              ),
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}

export function useDeleteCharacterInventoryItem(
  characterId: string,
  itemId: string,
) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: () => {
      context.requireSession()
      return deleteCharacterInventoryItem(context.api, characterId, itemId)
    },
    onSuccess: () => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              inventory: (character.inventory ?? []).filter(
                (item) => item.id !== itemId,
              ),
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
