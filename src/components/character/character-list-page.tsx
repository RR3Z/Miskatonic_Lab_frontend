"use client"

import { Plus } from "lucide-react"
import { CreateCharacterModal } from "@/components/character/create/create-character-modal"
import { CharacterListContent } from "@/components/character/list/character-list-content"
import { Button } from "@/components/ui/button"
import localizedContent from "@/data/locales/ru/character/list.ru.json"
import { useCharacters } from "@/hooks/character/use-characters"
import { useCreateCharacterIntent } from "@/hooks/character/use-create-character-intent"
import { useDeleteCharacter } from "@/hooks/character/use-delete-character"

export const MAX_CHARACTERS_PER_USER = 30

export function CharacterListPage() {
  const { data, error, isFetching, isLoading, refetch } = useCharacters()
  const deleteCharacter = useDeleteCharacter()
  const characters = data ?? []
  const hasLoadError = Boolean(error) && data === undefined
  const atLimit = characters.length >= MAX_CHARACTERS_PER_USER
  const creationUnavailable = isLoading || hasLoadError || atLimit
  const { createOpen, setCreateOpen } = useCreateCharacterIntent(
    !creationUnavailable,
  )

  return (
    <div className="mx-auto w-full max-w-[1720px] px-4 py-6 sm:px-8 sm:py-8 lg:py-10">
      <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6 sm:items-center">
        <h1 className="font-heading text-2xl font-semibold tracking-wide text-[var(--ml-ink-primary)] sm:text-3xl lg:text-4xl">
          {
            localizedContent.copy.componentsCharacterCharacterListPage
              .spisokPersonazhei
          }
          {hasLoadError ? "—" : characters.length}/{MAX_CHARACTERS_PER_USER})
        </h1>
        <Button
          aria-label={
            atLimit
              ? localizedContent.copy.componentsCharacterCharacterListPage
                  .sozdaniePersonazhaNedostupnoDostignutLimit
              : hasLoadError
                ? localizedContent.copy.componentsCharacterCharacterListPage
                    .sozdaniePersonazhaNedostupnoSpisokNeZagruzhen
                : localizedContent.copy.componentsCharacterCharacterListPage
                    .sozdatPersonazha
          }
          className={
            atLimit
              ? "disabled:opacity-100"
              : "border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)] text-[var(--ml-ink-primary)] hover:border-[var(--ml-border-aged)] hover:bg-[var(--ml-surface-panel-raised)] hover:text-[var(--ml-ink-primary)] focus-visible:border-[var(--ml-border-aged)] focus-visible:ring-[var(--ml-focus-ring)]/50"
          }
          disabled={creationUnavailable}
          onClick={() => setCreateOpen(true)}
          size="icon"
          type="button"
          variant={atLimit ? "destructive" : "outline"}
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>

      <CharacterListContent
        atLimit={atLimit}
        characters={characters}
        hasLoadError={hasLoadError}
        isFetching={isFetching}
        isLoading={isLoading}
        onCreate={() => setCreateOpen(true)}
        onDelete={(characterId) => deleteCharacter.mutateAsync(characterId)}
        onRetry={() => void refetch()}
      />

      <CreateCharacterModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
