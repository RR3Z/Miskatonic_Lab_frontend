"use client"

import { useMutation } from "@tanstack/react-query"

import type { CharacterResourceUpdate } from "@/dto/character/character-sheet-values.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { updateCharacterResource } from "@/lib/api/character-resources"

import { updateCharacterDetailResource } from "@/lib/api/update-character-detail-resource"

export function useUpdateCharacterResource(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterResourceUpdate) => {
      context.requireSession()
      return updateCharacterResource(context.api, characterId, input)
    },
    onSuccess: (update) => {
      context.updateDetail((character) =>
        character
          ? updateCharacterDetailResource(character, update)
          : character,
      )
      context.invalidateDetail()
    },
  })
}
