"use client"

import { DeleteResourceButton } from "@/components/character/detail/editors/delete-resource-button"
import { BackstorySectionCard } from "@/components/character/detail/tabs/backstory-section-card"
import { BACKSTORY_SECTIONS } from "@/components/character/detail/tabs/constants/backstory-sections.constants"
import { SectionTitle } from "@/components/character/detail/tabs/section-title"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { useDeleteCharacterBackstory } from "@/hooks/character/use-delete-character-backstory"
import type { CharacterBackstory } from "@/types/character.types"

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
        <SectionTitle>
          {localizedContent.copy.characterDetailTabsHistorySection.biografiya}
        </SectionTitle>
        {backstory.id ? (
          <DeleteResourceButton
            ariaLabel={
              localizedContent.copy.characterDetailTabsHistorySection
                .udalitBiografiyu
            }
            description={
              localizedContent.copy.characterDetailTabsHistorySection
                .opisanieIVseZapolnennyeRazdelyBiografii
            }
            errorMessage={
              localizedContent.copy.characterDetailTabsHistorySection
                .neUdalosUdalitBiografiyu
            }
            onDelete={() => deleteBackstory.mutateAsync()}
            title={
              localizedContent.copy.characterDetailTabsHistorySection
                .udalitBiografiyu2
            }
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
