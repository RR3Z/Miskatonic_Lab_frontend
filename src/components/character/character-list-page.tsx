"use client"

import { CircleAlert, Plus } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

import { CharacterCard } from "@/components/character/character-card"
import { CreateCharacterCard } from "@/components/character/create-character-card"
import { CreateCharacterModal } from "@/components/character/create-character-modal"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
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
  const shouldReduceMotion = useReducedMotion()
  const { data, error, isFetching, isLoading, refetch } = useCharacters()
  const deleteCharacter = useDeleteCharacter()
  const [createOpen, setCreateOpen] = useState(false)
  const characters = data ?? []
  const hasLoadError = Boolean(error) && data === undefined
  const atLimit = characters.length >= MAX_CHARACTERS_PER_USER
  const creationUnavailable = isLoading || hasLoadError || atLimit

  useEffect(() => {
    if (isLoading || atLimit || typeof window === "undefined") return
    const url = new URL(window.location.href)
    if (url.searchParams.get("create") !== "1") return

    setCreateOpen(true)
    url.searchParams.delete("create")
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`,
    )
  }, [atLimit, isLoading])

  return (
    <div className="mx-auto w-full max-w-[1720px] px-4 py-6 sm:px-8 sm:py-8 lg:py-10">
      <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6 sm:items-center">
        <h1 className="font-heading text-2xl font-semibold tracking-wide text-[var(--ml-ink-primary)] sm:text-3xl lg:text-4xl">
          Список персонажей ({hasLoadError ? "—" : characters.length}/
          {MAX_CHARACTERS_PER_USER})
        </h1>
        <Button
          aria-label={
            atLimit
              ? "Создание персонажа недоступно: достигнут лимит"
              : hasLoadError
                ? "Создание персонажа недоступно: список не загружен"
                : "Создать персонажа"
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

      <section
        aria-busy={isLoading || isFetching}
        aria-label="Список персонажей"
        className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {isLoading ? (
          <>
            <output className="sr-only" aria-live="polite">
              Загрузка персонажей…
            </output>
            {skeletonCards.map((key) => (
              <Skeleton
                aria-hidden="true"
                key={key}
                className="h-[104px] rounded-md border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)]/80"
              />
            ))}
          </>
        ) : hasLoadError ? (
          <Alert
            className="col-span-full border-destructive/70 bg-destructive/10"
            variant="destructive"
          >
            <CircleAlert aria-hidden="true" />
            <AlertTitle className="text-destructive">
              Не удалось загрузить персонажей
            </AlertTitle>
            <AlertDescription>
              Проверьте подключение и попробуйте получить список ещё раз.
            </AlertDescription>
            <AlertAction>
              <Button
                disabled={isFetching}
                onClick={() => void refetch()}
                size="sm"
                type="button"
                variant="secondary"
              >
                {isFetching ? (
                  <Spinner aria-hidden="true" data-icon="inline-start" />
                ) : null}
                {isFetching ? "Загрузка…" : "Повторить"}
              </Button>
            </AlertAction>
          </Alert>
        ) : (
          <AnimatePresence initial={!shouldReduceMotion} mode="popLayout">
            {characters.map((character, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="relative min-w-0"
                data-slot="character-motion-item"
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.98, y: -4 }
                }
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                key={character.id}
                layout={shouldReduceMotion ? false : "position"}
                transition={{
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.035, 0.18),
                  duration: shouldReduceMotion ? 0 : 0.24,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <CharacterCard
                  character={character}
                  onDelete={(characterId) =>
                    deleteCharacter.mutateAsync(characterId)
                  }
                />
              </motion.div>
            ))}
            {!atLimit ? (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="relative min-w-0"
                data-slot="create-character-motion-item"
                exit={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }
                }
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                key="create-character"
                layout={shouldReduceMotion ? false : "position"}
                transition={{
                  delay: shouldReduceMotion
                    ? 0
                    : Math.min(characters.length * 0.035, 0.18),
                  duration: shouldReduceMotion ? 0 : 0.24,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <CreateCharacterCard onCreate={() => setCreateOpen(true)} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        )}
      </section>

      <CreateCharacterModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
