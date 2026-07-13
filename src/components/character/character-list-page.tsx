"use client"

import { useEffect } from "react"
import { toast } from "sonner"

import { CharacterCard } from "@/components/character/character-card"
import { CreateCharacterCard } from "@/components/character/create-character-card"
import { useCharacters, useDeleteCharacter } from "@/lib/api/use-characters"

const skeletonCards = [
  "skeleton-card-1",
  "skeleton-card-2",
  "skeleton-card-3",
  "skeleton-card-4",
  "skeleton-card-5",
  "skeleton-card-6",
]

export const MAX_CHARACTERS_PER_USER = 30

export function CharacterListPage() {
  const { data, error, isLoading } = useCharacters()
  const deleteCharacter = useDeleteCharacter()
  const characters = data ?? []
  const atLimit = characters.length >= MAX_CHARACTERS_PER_USER

  useEffect(() => {
    if (!error) return

    toast.error("Не удалось загрузить персонажей. Попробуйте позже.", {
      id: "characters-load-error",
    })
  }, [error])

  return (
    <div className="mx-auto w-full max-w-[1720px] px-4 py-6 sm:px-8 sm:py-8 lg:py-10">
      <h1 className="mb-5 font-heading text-2xl font-semibold tracking-wide text-[var(--ml-ink-primary)] sm:mb-6 sm:text-3xl lg:text-4xl">
        Список персонажей ({characters.length}/{MAX_CHARACTERS_PER_USER})
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {isLoading
          ? skeletonCards.map((key) => (
              <div
                key={key}
                className="h-[104px] animate-pulse rounded-md border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)]/80"
              />
            ))
          : characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onDelete={(characterId) =>
                  deleteCharacter.mutateAsync(characterId)
                }
              />
            ))}
        <CreateCharacterCard atLimit={atLimit} />
      </div>
    </div>
  )
}
