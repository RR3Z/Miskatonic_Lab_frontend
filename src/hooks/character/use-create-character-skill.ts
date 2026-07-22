"use client"

import { useMutation } from "@tanstack/react-query"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import {
  type CharacterSkillInput,
  createCharacterSkill,
} from "@/lib/api/character-skills"

export function useCreateCharacterSkill(characterId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterSkillInput) => {
      context.requireSession()
      return createCharacterSkill(context.api, characterId, input)
    },
    onSuccess: (createdSkill) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              skills: [...(character.skills ?? []), createdSkill],
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
