"use client"

import { useMutation } from "@tanstack/react-query"

import type { UpdateCharacterCharacteristicsDto } from "@/dto/character/character-sheet-values.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { updateCharacterCharacteristics } from "@/lib/api/character-statistics"

import { fetchCharacter } from "@/lib/api/characters"

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
