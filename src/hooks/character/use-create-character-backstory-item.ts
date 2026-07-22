"use client"

import { useMutation } from "@tanstack/react-query"

import type { CharacterBackstoryItemDto } from "@/dto/character/character-backstory.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { createCharacterBackstoryItem } from "@/lib/api/character-backstory"

export function useCreateCharacterBackstoryItem(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterBackstoryItemDto) => {
      context.requireSession()
      return createCharacterBackstoryItem(context.api, characterId, input)
    },
    onSuccess: (item) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              backstory: {
                ...character.backstory,
                items: [...(character.backstory.items ?? []), item],
              },
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
