"use client"

import { useMutation } from "@tanstack/react-query"

import type {
  CharacterBackstoryItemDto,
  UpsertCharacterBackstoryDto,
} from "@/dto/character/character-backstory.dto"
import {
  createCharacterBackstoryItem,
  deleteCharacterBackstory,
  deleteCharacterBackstoryItem,
  updateCharacterBackstoryItem,
  upsertCharacterBackstory,
} from "@/lib/api/character-backstory"
import { useCharacterMutationContext } from "@/lib/api/use-character-mutation-context"

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

export function useDeleteCharacterBackstory(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: () => {
      context.requireSession()
      return deleteCharacterBackstory(context.api, characterId)
    },
    onSuccess: () => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              backstory: {
                character_id: character.id,
                created_at: null,
                id: null,
                items: [],
                personal_description: null,
                updated_at: null,
              },
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}

export function useCreateCharacterBackstoryItem(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterBackstoryItemDto) => {
      context.requireSession()
      return createCharacterBackstoryItem(context.api, characterId, input)
    },
    onSuccess: (item) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              backstory: {
                ...character.backstory,
                items: [...(character.backstory.items ?? []), item],
              },
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}

export function useUpdateCharacterBackstoryItem(
  characterId: string,
  itemId: string,
) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterBackstoryItemDto) => {
      context.requireSession()
      return updateCharacterBackstoryItem(
        context.api,
        characterId,
        itemId,
        input,
      )
    },
    onSuccess: (updatedItem) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              backstory: {
                ...character.backstory,
                items: (character.backstory.items ?? []).map((item) =>
                  item.id === itemId ? updatedItem : item,
                ),
              },
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}

export function useDeleteCharacterBackstoryItem(
  characterId: string,
  itemId: string,
) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: () => {
      context.requireSession()
      return deleteCharacterBackstoryItem(context.api, characterId, itemId)
    },
    onSuccess: () => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              backstory: {
                ...character.backstory,
                items: (character.backstory.items ?? []).filter(
                  (item) => item.id !== itemId,
                ),
              },
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
