"use client"

import { useMutation } from "@tanstack/react-query"

import type { UpdateCharacterFinancesDto } from "@/dto/character/character-finances.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { updateCharacterFinances } from "@/lib/api/character-finances"

export function useUpdateCharacterFinances(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: UpdateCharacterFinancesDto) => {
      context.requireSession()
      return updateCharacterFinances(context.api, characterId, input)
    },
    onSuccess: (_, input) => {
      context.updateDetail((character) => {
        if (!character) return character

        return {
          ...character,
          finances: {
            ...character.finances,
            assets: input.assets ?? character.finances.assets,
            cash: input.cash ?? character.finances.cash,
            spending_limit:
              input.spending_limit ?? character.finances.spending_limit,
          },
        }
      })
      context.invalidateDetail()
    },
  })
}
