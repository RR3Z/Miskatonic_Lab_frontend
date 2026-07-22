"use client"

import { useMutation } from "@tanstack/react-query"

import type { CharacterInventoryItemDto } from "@/dto/character/character-inventory-item.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { updateCharacterInventoryItem } from "@/lib/api/character-inventory"

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
