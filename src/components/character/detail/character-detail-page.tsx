"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { CharacterDetailError } from "@/components/character/detail/character-detail-error"
import { CharacterDetailLoading } from "@/components/character/detail/character-detail-loading"
import { Button } from "@/components/ui/button"
import { useCharacter } from "@/lib/api/use-characters"
import { appRoutes } from "@/lib/routes/app-routes"

type CharacterDetailPageProps = {
  characterId: string
}

function isNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    error.response instanceof Response &&
    error.response.status === 404
  )
}

export function CharacterDetailPage({ characterId }: CharacterDetailPageProps) {
  const { data, error, isFetching, isPending, refetch } =
    useCharacter(characterId)

  if (isPending) return <CharacterDetailLoading />

  if (error || !data) {
    return (
      <CharacterDetailError
        isFetching={isFetching}
        notFound={isNotFoundError(error)}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1720px] px-8 py-10">
      <Button asChild size="sm" variant="ghost">
        <Link href={appRoutes.characters}>
          <ArrowLeft aria-hidden="true" />К списку персонажей
        </Link>
      </Button>
      <section className="mt-5 rounded-md border border-[var(--ml-border-subtle)] bg-[var(--ml-surface-panel)] p-6">
        <p className="font-body text-sm uppercase tracking-[0.18em] text-[var(--ml-accent-brass-strong)]">
          Лист сыщика
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-[var(--ml-ink-primary)]">
          {data.name}
        </h1>
        <p className="mt-2 font-body text-base text-[var(--ml-ink-muted)]">
          {[data.occupation, data.age !== null ? `${data.age} лет` : null]
            .filter(Boolean)
            .join(", ") || "Основные сведения не заполнены"}
        </p>
      </section>
    </div>
  )
}
