"use client"

import { useMutation } from "@tanstack/react-query"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { deleteCharacterBackstoryItem } from "@/lib/api/character-backstory"

export function useDeleteCharacterBackstoryItem(
  characterId: string,
  itemId: string,
) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: () => {
      context.requireSession()
      return deleteCharacterBackstoryItem(context.api, characterId, itemId)
    },
    onSuccess: () => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              backstory: {
                ...character.backstory,
                items: (character.backstory.items ?? []).filter(
                  (item) => item.id !== itemId,
                ),
              },
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
