"use client"

import { useMutation } from "@tanstack/react-query"

import type { UpsertCharacterBackstoryDto } from "@/dto/character/character-backstory.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { upsertCharacterBackstory } from "@/lib/api/character-backstory"

export function useUpsertCharacterBackstory(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: UpsertCharacterBackstoryDto) => {
      context.requireSession()
      return upsertCharacterBackstory(context.api, characterId, input)
    },
    onSuccess: (backstory) => {
      context.updateDetail((character) =>
        character ? { ...character, backstory } : character,
      )
      context.invalidateDetail()
    },
  })
}
