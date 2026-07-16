"use client"

import { useMutation } from "@tanstack/react-query"

import {
  type CharacterDiceRollRequest,
  makeCharacterDiceRoll,
} from "@/lib/api/character-dice-rolls"
import { useCharacterMutationContext } from "@/lib/api/use-character-mutation-context"

export function useMakeCharacterDiceRoll(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: string | CharacterDiceRollRequest) => {
      context.requireSession()
      return makeCharacterDiceRoll(context.api, characterId, input)
    },
  })
}
