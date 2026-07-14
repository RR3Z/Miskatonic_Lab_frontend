"use client"

import { useMutation } from "@tanstack/react-query"

import type {
  CharacterResourceKey,
  CharacterResourceUpdate,
} from "@/dto/character/character-sheet-values.dto"
import {
  deleteCharacterResource,
  updateCharacterResource,
} from "@/lib/api/character-resources"
import { createEmptyCharacterResource } from "@/lib/api/create-empty-character-resource"
import { updateCharacterDetailResource } from "@/lib/api/update-character-detail-resource"
import { useCharacterMutationContext } from "@/lib/api/use-character-mutation-context"

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
