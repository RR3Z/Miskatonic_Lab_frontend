"use client"

import { useMutation } from "@tanstack/react-query"

import type { CharacterResourceKey } from "@/dto/character/character-sheet-values.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { deleteCharacterResource } from "@/lib/api/character-resources"

import { createEmptyCharacterResource } from "@/lib/api/create-empty-character-resource"

export function useDeleteCharacterResource(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (resource: CharacterResourceKey) => {
      context.requireSession()
      return deleteCharacterResource(context.api, characterId, resource)
    },
    onSuccess: (_, resource) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              [resource]: createEmptyCharacterResource(characterId, resource),
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
