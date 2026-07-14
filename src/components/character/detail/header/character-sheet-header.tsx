"use client"

import { CharacterCharacteristicsSection } from "@/components/character/detail/header/character-characteristics-section"
import { CharacterDerivedStatsSection } from "@/components/character/detail/header/character-derived-stats-section"
import { CharacterIdentitySection } from "@/components/character/detail/header/character-identity-section"
import { CharacterResourcesSection } from "@/components/character/detail/header/character-resources-section"
import { CharacterStatesSection } from "@/components/character/detail/header/character-states-section"
import { Separator } from "@/components/ui/separator"
import type { CharacterDetail } from "@/types/character"

export function CharacterSheetHeader({
  character,
}: {
  character: CharacterDetail
}) {
  return (
    <header
      className="relative grid shrink-0 grid-cols-[minmax(360px,1fr)_1px_minmax(260px,0.95fr)_1px_minmax(150px,0.55fr)_1px_minmax(492px,1.4fr)] items-stretch gap-2 overflow-hidden rounded-md border border-[var(--ml-border-aged)] bg-[var(--ml-surface-panel)] p-2 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
      data-testid="character-sheet-header"
    >
      <CharacterIdentitySection character={character} />

      <Separator
        className="my-1 bg-[var(--ml-border-subtle)]"
        orientation="vertical"
      />

      <CharacterCharacteristicsSection character={character} />

      <Separator
        className="my-1 bg-[var(--ml-border-subtle)]"
        orientation="vertical"
      />

      <CharacterDerivedStatsSection character={character} />

      <Separator
        className="my-1 bg-[var(--ml-border-subtle)]"
        orientation="vertical"
      />

      <div className="grid h-full min-w-0 self-stretch grid-cols-[minmax(175px,0.7fr)_1px_minmax(300px,1.3fr)] items-stretch gap-2">
        <CharacterResourcesSection character={character} />

        <Separator
          className="my-1 bg-[var(--ml-border-subtle)]"
          orientation="vertical"
        />

        <CharacterStatesSection character={character} />
      </div>
    </header>
  )
}
