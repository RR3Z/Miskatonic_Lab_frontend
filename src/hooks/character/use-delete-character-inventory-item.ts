"use client"

import { useMutation } from "@tanstack/react-query"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { deleteCharacterInventoryItem } from "@/lib/api/character-inventory"

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
