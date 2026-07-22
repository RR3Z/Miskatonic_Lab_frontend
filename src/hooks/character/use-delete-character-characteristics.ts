"use client"

import { useMutation } from "@tanstack/react-query"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { deleteCharacterCharacteristics } from "@/lib/api/character-statistics"

export function useDeleteCharacterCharacteristics(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: () => {
      context.requireSession()
      return deleteCharacterCharacteristics(context.api, characterId)
    },
    onSuccess: () => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              characteristics: {
                appearance: null,
                character_id: characterId,
                constitution: null,
                created_at: null,
                dexterity: null,
                education: null,
                id: null,
                intelligence: null,
                power: null,
                size: null,
                strength: null,
                updated_at: null,
              },
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
