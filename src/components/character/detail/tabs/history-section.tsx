"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { BackstorySectionCard } from "@/components/character/detail/tabs/backstory-section-card"
import { BACKSTORY_SECTIONS } from "@/components/character/detail/tabs/backstory-sections"
import { SectionTitle } from "@/components/character/detail/tabs/section-title"
import { useDeleteCharacterBackstory } from "@/lib/api/use-character-backstory"
import type { CharacterBackstory } from "@/types/character"

export function HistorySection({
  backstory,
  characterId,
}: {
  backstory: CharacterBackstory
  characterId: string
}) {
  const deleteBackstory = useDeleteCharacterBackstory(characterId)

  return (
    <section className="space-y-3" data-testid="character-history-content">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle>Биография</SectionTitle>
        {backstory.id ? (
          <DeleteResourceButton
            ariaLabel="Удалить биографию"
            description="Описание и все заполненные разделы биографии будут удалены."
            errorMessage="Не удалось удалить биографию"
            onDelete={() => deleteBackstory.mutateAsync()}
            title="Удалить биографию?"
          />
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {BACKSTORY_SECTIONS.map((section) => (
          <BackstorySectionCard
            backstory={backstory}
            characterId={characterId}
            key={section.key}
            section={section}
          />
        ))}
      </div>
    </section>
  )
}
