"use client"

import { useMutation } from "@tanstack/react-query"

import type { CreateCharacterNoteDto } from "@/dto/character/create-character-note.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { createCharacterNote } from "@/lib/api/character-notes"

export function useCreateCharacterNote(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CreateCharacterNoteDto) => {
      context.requireSession()
      return createCharacterNote(context.api, characterId, input)
    },
    onSuccess: (note) => {
      context.updateDetail((character) =>
        character
          ? { ...character, notes: [...(character.notes ?? []), note] }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
