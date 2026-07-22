"use client"

import { useMutation } from "@tanstack/react-query"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { deleteCharacterFinances } from "@/lib/api/character-finances"

export function useDeleteCharacterFinances(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: () => {
      context.requireSession()
      return deleteCharacterFinances(context.api, characterId)
    },
    onSuccess: () => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              finances: {
                assets: null,
                cash: null,
                created_at: null,
                id: null,
                spending_limit: null,
                updated_at: null,
              },
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
