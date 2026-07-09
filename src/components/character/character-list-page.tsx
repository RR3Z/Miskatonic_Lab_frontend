"use client"

import { CharacterCard } from "@/components/character/character-card"
import { CreateCharacterCard } from "@/components/character/create-character-card"
import { useCharacters } from "@/lib/api/use-characters"

const skeletonCards = [
  "skeleton-card-1",
  "skeleton-card-2",
  "skeleton-card-3",
  "skeleton-card-4",
  "skeleton-card-5",
  "skeleton-card-6",
]

export function CharacterListPage() {
  const { data, error, isLoading } = useCharacters()
  const characters = data ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-2xl font-semibold tracking-wide text-[var(--ml-ink-primary)] sm:text-3xl">
        Список персонажей
      </h1>

      {error ? (
        <p className="mb-4 font-body text-sm text-[var(--ml-accent-danger)]">
          Не удалось загрузить персонажей. Попробуйте позже.
        </p>
      ) : null}

      {!isLoading && !error && characters.length === 0 ? (
        <p className="mb-4 font-body text-sm text-[var(--ml-ink-muted)]">
          У вас пока нет персонажей
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? skeletonCards.map((key) => (
              <div
                key={key}
                className="h-40 animate-pulse rounded-lg bg-[var(--ml-surface-panel)]"
              />
            ))
          : characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
        <CreateCharacterCard />
      </div>
    </div>
  )
}
