"use client"

import { useMutation } from "@tanstack/react-query"

import type { CreateCharacterNoteDto } from "@/dto/character/create-character-note.dto"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import { updateCharacterNote } from "@/lib/api/character-notes"

export function useUpdateCharacterNote(characterId: string, noteId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CreateCharacterNoteDto) => {
      context.requireSession()
      return updateCharacterNote(context.api, characterId, noteId, input)
    },
    onSuccess: (updatedNote) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              notes: (character.notes ?? []).map((note) =>
                note.id === noteId ? updatedNote : note,
              ),
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
