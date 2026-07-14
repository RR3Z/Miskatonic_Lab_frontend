"use client"

import { useMutation } from "@tanstack/react-query"

import type {
  UpdateCharacterCharacteristicsDto,
  UpdateCharacterDerivedStatsDto,
} from "@/dto/character/character-sheet-values.dto"
import {
  deleteCharacterCharacteristics,
  deleteCharacterDerivedStats,
  updateCharacterCharacteristics,
  updateCharacterDerivedStats,
} from "@/lib/api/character-statistics"
import { useCharacterMutationContext } from "@/lib/api/use-character-mutation-context"

export function useUpdateCharacterCharacteristics(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: UpdateCharacterCharacteristicsDto) => {
      context.requireSession()
      return updateCharacterCharacteristics(context.api, characterId, input)
    },
    onSuccess: (characteristics) => {
      context.updateDetail((character) =>
        character ? { ...character, characteristics } : character,
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

export function useUpdateCharacterDerivedStats(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: UpdateCharacterDerivedStatsDto) => {
      context.requireSession()
      return updateCharacterDerivedStats(context.api, characterId, input)
    },
    onSuccess: (derivedStats) => {
      context.updateDetail((character) =>
        character ? { ...character, derived_stats: derivedStats } : character,
      )
      context.invalidateDetail()
    },
  })
}

export function useDeleteCharacterDerivedStats(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: () => {
      context.requireSession()
      return deleteCharacterDerivedStats(context.api, characterId)
    },
    onSuccess: () => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              derived_stats: {
                character_id: characterId,
                created_at: null,
                damage_bonus: null,
                dodge_value: null,
                id: null,
                physique: null,
                speed: null,
                updated_at: null,
              },
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
