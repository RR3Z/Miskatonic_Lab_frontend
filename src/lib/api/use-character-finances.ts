"use client"

import { useMutation } from "@tanstack/react-query"

import type { UpdateCharacterFinancesDto } from "@/dto/character/character-finances.dto"
import {
  deleteCharacterFinances,
  updateCharacterFinances,
} from "@/lib/api/character-finances"
import { useCharacterMutationContext } from "@/lib/api/use-character-mutation-context"

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

        const creditRating = input.credit_rating_skill_id
          ? (character.skills ?? []).find(
              (skill) => skill.id === input.credit_rating_skill_id,
            )
          : character.finances.credit_rating

        return {
          ...character,
          finances: {
            ...character.finances,
            assets: input.assets ?? character.finances.assets,
            cash: input.cash ?? character.finances.cash,
            credit_rating: creditRating,
            spending_limit:
              input.spending_limit ?? character.finances.spending_limit,
          },
        }
      })
      context.invalidateDetail()
    },
  })
}

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
                credit_rating: null,
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
