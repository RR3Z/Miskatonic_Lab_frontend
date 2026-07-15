"use client"

import { useMutation } from "@tanstack/react-query"

import type { UpdateCharacterCharacteristicsDto } from "@/dto/character/character-sheet-values.dto"
import {
  deleteCharacterCharacteristics,
  updateCharacterCharacteristics,
} from "@/lib/api/character-statistics"
import { fetchCharacter } from "@/lib/api/characters"
import { useCharacterMutationContext } from "@/lib/api/use-character-mutation-context"

export function useUpdateCharacterCharacteristics(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: async (input: UpdateCharacterCharacteristicsDto) => {
      context.requireSession()
      const characteristics = await updateCharacterCharacteristics(
        context.api,
        characterId,
        input,
      )

      try {
        const character = await fetchCharacter(context.api, characterId)
        return { characteristics, derivedStats: character.derived_stats }
      } catch {
        return { characteristics, derivedStats: null }
      }
    },
    onSuccess: ({ characteristics, derivedStats }) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              characteristics,
              ...(derivedStats ? { derived_stats: derivedStats } : {}),
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}

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
