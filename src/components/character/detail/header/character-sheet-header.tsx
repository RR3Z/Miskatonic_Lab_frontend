"use client"

import { CharacterCharacteristicsSection } from "@/components/character/detail/header/character-characteristics-section"
import { CharacterDerivedStatsSection } from "@/components/character/detail/header/character-derived-stats-section"
import { CharacterIdentitySection } from "@/components/character/detail/header/character-identity-section"
import { CharacterResourcesSection } from "@/components/character/detail/header/character-resources-section"
import { CharacterStatesSection } from "@/components/character/detail/header/character-states-section"
import { Separator } from "@/components/ui/separator"
import type { CharacterDetail } from "@/types/character.types"

export function CharacterSheetHeader({
  character,
}: {
  character: CharacterDetail
}) {
  return (
    <header
      className="relative grid shrink-0 grid-cols-1 items-stretch gap-3 overflow-hidden rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] p-2 shadow-[0_18px_45px_rgba(0,0,0,0.18)] md:grid-cols-2 md:gap-2 xl:grid-cols-[minmax(330px,1fr)_1px_minmax(220px,0.95fr)_1px_minmax(125px,0.55fr)_1px_minmax(430px,1.4fr)]"
      data-testid="character-sheet-header"
    >
      <CharacterIdentitySection character={character} />

      <Separator
        className="my-1 hidden bg-[var(--ml-border-subtle)] xl:block"
        orientation="vertical"
      />

      <CharacterCharacteristicsSection character={character} />

      <Separator
        className="my-1 hidden bg-[var(--ml-border-subtle)] xl:block"
        orientation="vertical"
      />

      <CharacterDerivedStatsSection character={character} />

      <Separator
        className="my-1 hidden bg-[var(--ml-border-subtle)] xl:block"
        orientation="vertical"
      />

      <div className="grid h-full min-w-0 self-stretch grid-cols-1 items-stretch gap-3 sm:grid-cols-[minmax(150px,0.7fr)_1px_minmax(260px,1.3fr)] sm:gap-2 md:col-span-2 xl:col-span-1">
        <CharacterResourcesSection character={character} />

        <Separator
          className="my-1 hidden bg-[var(--ml-border-subtle)] sm:block"
          orientation="vertical"
        />

        <CharacterStatesSection character={character} />
      </div>
    </header>
  )
}
