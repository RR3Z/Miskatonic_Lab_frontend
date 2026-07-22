"use client"

import { useMutation } from "@tanstack/react-query"

import { useCharacterMutationContext } from "@/hooks/character/use-character-mutation-context"

import {
  type CharacterSkillInput,
  updateCharacterSkill,
} from "@/lib/api/character-skills"

export function useUpdateCharacterSkill(characterId: string, skillId: string) {
  const context = useCharacterMutationContext(characterId)

  return useMutation({
    mutationFn: (input: CharacterSkillInput) => {
      context.requireSession()
      return updateCharacterSkill(context.api, characterId, skillId, input)
    },
    onSuccess: (updatedSkill) => {
      context.updateDetail((character) =>
        character
          ? {
              ...character,
              skills: (character.skills ?? []).map((skill) =>
                skill.id === skillId ? updatedSkill : skill,
              ),
            }
          : character,
      )
      context.invalidateDetail()
    },
  })
}
