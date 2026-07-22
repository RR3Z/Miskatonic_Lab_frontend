"use client"

import { useMutation } from "@tanstack/react-query"

import type { CharacterBackstoryItemDto } from "@/dto/character/character-backstory.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { updateCharacterBackstoryItem } from "@/lib/api/character-backstory"

export function useUpdateCharacterBackstoryItem(
  characterId: string,
  itemId: string,
) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterBackstoryItemDto) => {
      context.requireSession()
      return updateCharacterBackstoryItem(
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
              backstory: {
                ...character.backstory,
                items: (character.backstory.items ?? []).map((item) =>
                  item.id === itemId ? updatedItem : item,
                ),
              },
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
