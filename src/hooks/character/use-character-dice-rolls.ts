"use client"

import { useMutation } from "@tanstack/react-query"
import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"
import {
  type CharacterDiceRollRequest,
  makeCharacterDiceRoll,
} from "@/lib/api/character-dice-rolls"

export function useMakeCharacterDiceRoll(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: string | CharacterDiceRollRequest) => {
      context.requireSession()
      return makeCharacterDiceRoll(context.api, characterId, input)
    },
  })
}
